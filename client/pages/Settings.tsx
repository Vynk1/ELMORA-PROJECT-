import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { t, type Language } from "../utils/translations";

interface UserSettings {
  notifications: {
    dailyReminders: boolean;
    taskDeadlines: boolean;
    friendActivity: boolean;
    weeklyReports: boolean;
    motivationalQuotes: boolean;
    meditationReminders: boolean;
  };
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    shareProgress: boolean;
    shareJournal: boolean;
    dataCollection: boolean;
    analyticsTracking: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
    weekStartDay: "monday" | "sunday";
    defaultMoodColor: "sad" | "mid" | "amazing";
    reminderTime: string;
  };
  account: {
    email: string;
    name: string;
    phoneNumber: string;
    emergencyContact: string;
  };
}

const Settings: React.FC = () => {
  const { state, setTheme, setLanguage, updatePreferences } = useApp();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      dailyReminders: true,
      taskDeadlines: true,
      friendActivity: false,
      weeklyReports: true,
      motivationalQuotes: true,
      meditationReminders: true,
    },
    privacy: {
      profileVisibility: "friends",
      shareProgress: true,
      shareJournal: false,
      dataCollection: true,
      analyticsTracking: false,
    },
    preferences: {
      theme: "light",
      language: "en",
      timezone: "UTC-5",
      weekStartDay: "monday",
      defaultMoodColor: "mid",
      reminderTime: "09:00",
    },
    account: {
      email: "Vinayak.com",
      name: "Vinayak Gupta",
      phoneNumber: "+91 98765-43210",
      emergencyContact: "+1 (555) 987-6543",
    },
  });

  const [activeSection, setActiveSection] = useState<
    "notifications" | "privacy" | "preferences" | "account" | "data"
  >("notifications");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateSetting = (
    section: keyof UserSettings,
    key: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const sections = [
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "preferences", name: "Preferences", icon: "⚙️" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "data", name: "Data & Storage", icon: "💾" },
  ];

  const exportData = () => {
    // Simulate data export
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      dataTypes: [
        "tasks",
        "journal_entries",
        "meditation_sessions",
        "goals",
        "progress",
      ],
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elmora-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const DeleteAccountModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600">
              This action cannot be undone. All your data including tasks,
              journal entries, and progress will be permanently deleted.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-red-50 rounded-2xl p-4">
              <h4 className="font-medium text-red-800 mb-2">
                What will be deleted:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• All tasks and goals</li>
                <li>• Journal entries and progress</li>
                <li>• Meditation history</li>
                <li>• Friend connections</li>
                <li>• Reward points and achievements</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert(
                  "Account deletion initiated. You would receive a confirmation email.",
                );
                setShowDeleteModal(false);
              }}
              className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Customize your ELMORA experience
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-8">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`
                      w-full text-left px-4 py-3 rounded-2xl flex items-center space-x-3 transition-colors
                      ${
                        activeSection === section.id
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span>{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(settings.notifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <h3 className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {key === "dailyReminders" &&
                                "Get reminded to complete your daily tasks"}
                              {key === "taskDeadlines" &&
                                "Notifications before task deadlines"}
                              {key === "friendActivity" &&
                                "Updates about your friends' progress"}
                              {key === "weeklyReports" &&
                                "Weekly summary of your achievements"}
                              {key === "motivationalQuotes" &&
                                "Daily inspirational messages"}
                              {key === "meditationReminders" &&
                                "Gentle reminders to meditate"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                updateSetting(
                                  "notifications",
                                  key,
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-6">
                    Privacy Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) =>
                          updateSetting(
                            "privacy",
                            "profileVisibility",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="public">Public - Anyone can see</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private - Only me</option>
                      </select>
                    </div>

                    {Object.entries(settings.privacy)
                      .filter(([key]) => key !== "profileVisibility")
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <h3 className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {key === "shareProgress" &&
                                "Allow friends to see your task completion progress"}
                              {key === "shareJournal" &&
                                "Share journal entries with selected friends"}
                              {key === "dataCollection" &&
                                "Help improve the app with usage analytics"}
                              {key === "analyticsTracking" &&
                                "Allow tracking for personalized recommendations"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value as boolean}
                              onChange={(e) =>
                                updateSetting("privacy", key, e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === "preferences" && (
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-6">
                    App Preferences
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("theme", state.language as Language)}
                      </label>
                      <select
                        value={state.theme}
                        onChange={(e) =>
                          setTheme(e.target.value as "light" | "dark" | "auto")
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="light">
                          {t("lightMode", state.language as Language)}
                        </option>
                        <option value="dark">
                          {t("darkMode", state.language as Language)}
                        </option>
                        <option value="auto">
                          {t("autoMode", state.language as Language)}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("language", state.language as Language)}
                      </label>
                      <select
                        value={state.language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Week Starts On
                      </label>
                      <select
                        value={settings.preferences.weekStartDay}
                        onChange={(e) =>
                          updateSetting(
                            "preferences",
                            "weekStartDay",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="monday">Monday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Mood
                      </label>
                      <select
                        value={settings.preferences.defaultMoodColor}
                        onChange={(e) =>
                          updateSetting(
                            "preferences",
                            "defaultMoodColor",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="sad">Sad (Dark theme)</option>
                        <option value="mid">Mid Mood (Balanced theme)</option>
                        <option value="amazing">Amazing (Bright theme)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.preferences.reminderTime}
                        onChange={(e) =>
                          updateSetting(
                            "preferences",
                            "reminderTime",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) =>
                          updateSetting(
                            "preferences",
                            "timezone",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">GMT (UTC+0)</option>
                        <option value="UTC+1">CET (UTC+1)</option>
                        <option value="UTC+5:30">IST (UTC+5:30)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Section */}
              {activeSection === "account" && (
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-6">
                    Account Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.account.name}
                        onChange={(e) =>
                          updateSetting("account", "name", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.account.email}
                        onChange={(e) =>
                          updateSetting("account", "email", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.account.phoneNumber}
                        onChange={(e) =>
                          updateSetting(
                            "account",
                            "phoneNumber",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        value={settings.account.emergencyContact}
                        onChange={(e) =>
                          updateSetting(
                            "account",
                            "emergencyContact",
                            e.target.value,
                          )
                        }
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Phone number for crisis support"
                      />
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Crisis Support
                      </h4>
                      <p className="text-sm text-blue-700">
                        If you're in crisis, please reach out immediately:
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-blue-700">
                        <div>
                          🇺🇸 US:{" "}
                          <a href="tel:988" className="font-medium">
                            988 Suicide & Crisis Lifeline
                          </a>
                        </div>
                        <div>
                          🇬🇧 UK:{" "}
                          <a href="tel:116123" className="font-medium">
                            116 123 Samaritans
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage Section */}
              {activeSection === "data" && (
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-6">
                    Data & Storage
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">📊</span>
                        <h3 className="text-lg font-medium text-green-800">
                          Export Your Data
                        </h3>
                      </div>
                      <p className="text-green-700 mb-4">
                        Download all your data including tasks, journal entries,
                        meditation history, and progress.
                      </p>
                      <button
                        onClick={exportData}
                        className="bg-green-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-green-700 transition-colors"
                      >
                        Download Data Export
                      </button>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">☁️</span>
                        <h3 className="text-lg font-medium text-blue-800">
                          Backup & Sync
                        </h3>
                      </div>
                      <p className="text-blue-700 mb-4">
                        Your data is automatically backed up and synced across
                        your devices.
                      </p>
                      <div className="text-sm text-blue-600">
                        <div>Last backup: 2 hours ago</div>
                        <div>Storage used: 12.4 MB</div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">🗑️</span>
                        <h3 className="text-lg font-medium text-orange-800">
                          Clear App Data
                        </h3>
                      </div>
                      <p className="text-orange-700 mb-4">
                        Remove all cached data and reset the app to its initial
                        state. Your synced data will remain safe.
                      </p>
                      <button
                        onClick={() => alert("App data cleared successfully!")}
                        className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-orange-700 transition-colors"
                      >
                        Clear Cache
                      </button>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">⚠️</span>
                        <h3 className="text-lg font-medium text-red-800">
                          Delete Account
                        </h3>
                      </div>
                      <p className="text-red-700 mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => alert("Settings saved successfully!")}
                  className="bg-primary text-white px-8 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal />
    </div>
  );
};

export default Settings;
