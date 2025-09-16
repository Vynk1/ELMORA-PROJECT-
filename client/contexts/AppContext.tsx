import React, { createContext, useContext, useReducer, useEffect } from "react";

interface AppState {
  theme: "light" | "dark" | "auto";
  language: string;
  preferences: {
    weekStartDay: "monday" | "sunday";
    reminderTime: string;
    timezone: string;
  };
}

interface AppContextType {
  state: AppState;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  setLanguage: (language: string) => void;
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;
}

type AppAction =
  | { type: "SET_THEME"; payload: "light" | "dark" | "auto" }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<AppState["preferences"]> }
  | { type: "LOAD_SETTINGS"; payload: Partial<AppState> };

const initialState: AppState = {
  theme: "light",
  language: "en",
  preferences: {
    weekStartDay: "monday",
    reminderTime: "09:00",
    timezone: "UTC-5",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case "LOAD_SETTINGS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("elmora-app-settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: "LOAD_SETTINGS", payload: parsedSettings });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("elmora-app-settings", JSON.stringify(state));

    // Apply theme to document
    const root = document.documentElement;

    if (state.theme === "dark") {
      root.classList.add("dark");
    } else if (state.theme === "light") {
      root.classList.remove("dark");
    } else {
      // Auto theme - follow system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [state]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (state.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [state.theme]);

  const setTheme = (theme: "light" | "dark" | "auto") => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  const setLanguage = (language: string) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const updatePreferences = (preferences: Partial<AppState["preferences"]>) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: preferences });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setTheme,
        setLanguage,
        updatePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
