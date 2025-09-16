export type Language = "en" | "es" | "fr" | "de" | "it";

export interface Translations {
  // Navigation
  home: string;
  tasks: string;
  journal: string;
  meditation: string;
  goals: string;
  friends: string;
  rewards: string;
  settings: string;
  profile: string;
  help: string;

  // Common actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  next: string;
  back: string;
  complete: string;
  close: string;

  // Dashboard
  welcome: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  quickActions: string;
  recentActivity: string;
  dailyAffirmation: string;

  // Moods
  moodSad: string;
  moodMid: string;
  moodAmazing: string;
  selectMood: string;
  changeMood: string;

  // Tasks
  addTask: string;
  completeTask: string;
  deleteTask: string;
  taskCompleted: string;
  tasksRemaining: string;
  quickAdd: string;

  // Check-in
  dailyCheckIn: string;
  howAreYouFeeling: string;
  energyLevel: string;
  gratitude: string;
  aiInsight: string;
  checkInComplete: string;

  // Settings
  theme: string;
  lightMode: string;
  darkMode: string;
  autoMode: string;
  language: string;
  notifications: string;
  privacy: string;
  preferences: string;
  account: string;

  // Time
  today: string;
  yesterday: string;
  tomorrow: string;
  thisWeek: string;
  thisMonth: string;

  // Messages
  loading: string;
  error: string;
  success: string;
  noData: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    tasks: "Tasks",
    journal: "Journal",
    meditation: "Meditation",
    goals: "Goals",
    friends: "Friends",
    rewards: "Rewards",
    settings: "Settings",
    profile: "Profile",
    help: "Help",

    // Common actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    next: "Next",
    back: "Back",
    complete: "Complete",
    close: "Close",

    // Dashboard
    welcome: "Welcome back!",
    goodMorning: "Good morning!",
    goodAfternoon: "Good afternoon!",
    goodEvening: "Good evening!",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    dailyAffirmation: "Daily Affirmation",

    // Moods
    moodSad: "Feeling Sad",
    moodMid: "Mid Mood",
    moodAmazing: "Feeling Amazing",
    selectMood: "Select your mood",
    changeMood: "Change mood",

    // Tasks
    addTask: "Add Task",
    completeTask: "Complete Task",
    deleteTask: "Delete Task",
    taskCompleted: "Task completed!",
    tasksRemaining: "tasks remaining",
    quickAdd: "Quick Add",

    // Check-in
    dailyCheckIn: "Daily Check-In",
    howAreYouFeeling: "How are you feeling?",
    energyLevel: "Energy Level",
    gratitude: "Gratitude",
    aiInsight: "AI Insight",
    checkInComplete: "Check-in complete!",

    // Settings
    theme: "Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    autoMode: "Auto Mode",
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy",
    preferences: "Preferences",
    account: "Account",

    // Time
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    thisMonth: "This Month",

    // Messages
    loading: "Loading...",
    error: "An error occurred",
    success: "Success!",
    noData: "No data available",
  },

  es: {
    // Navigation
    home: "Inicio",
    tasks: "Tareas",
    journal: "Diario",
    meditation: "Meditación",
    goals: "Objetivos",
    friends: "Amigos",
    rewards: "Recompensas",
    settings: "Configuración",
    profile: "Perfil",
    help: "Ayuda",

    // Common actions
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    next: "Siguiente",
    back: "Atrás",
    complete: "Completar",
    close: "Cerrar",

    // Dashboard
    welcome: "¡Bienvenido de vuelta!",
    goodMorning: "¡Buenos días!",
    goodAfternoon: "¡Buenas tardes!",
    goodEvening: "¡Buenas noches!",
    quickActions: "Acciones Rápidas",
    recentActivity: "Actividad Reciente",
    dailyAffirmation: "Afirmación Diaria",

    // Moods
    moodSad: "Sintiéndome Triste",
    moodMid: "Estado de Ánimo Medio",
    moodAmazing: "Sintiéndome Increíble",
    selectMood: "Selecciona tu estado de ánimo",
    changeMood: "Cambiar estado de ánimo",

    // Tasks
    addTask: "Agregar Tarea",
    completeTask: "Completar Tarea",
    deleteTask: "Eliminar Tarea",
    taskCompleted: "¡Tarea completada!",
    tasksRemaining: "tareas restantes",
    quickAdd: "Agregar Rápido",

    // Check-in
    dailyCheckIn: "Registro Diario",
    howAreYouFeeling: "¿Cómo te sientes?",
    energyLevel: "Nivel de Energía",
    gratitude: "Gratitud",
    aiInsight: "Perspectiva IA",
    checkInComplete: "¡Registro completado!",

    // Settings
    theme: "Tema",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    autoMode: "Modo Automático",
    language: "Idioma",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    preferences: "Preferencias",
    account: "Cuenta",

    // Time
    today: "Hoy",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    thisWeek: "Esta Semana",
    thisMonth: "Este Mes",

    // Messages
    loading: "Cargando...",
    error: "Ocurrió un error",
    success: "¡Éxito!",
    noData: "No hay datos disponibles",
  },

  fr: {
    // Navigation
    home: "Accueil",
    tasks: "Tâches",
    journal: "Journal",
    meditation: "Méditation",
    goals: "Objectifs",
    friends: "Amis",
    rewards: "Récompenses",
    settings: "Paramètres",
    profile: "Profil",
    help: "Aide",

    // Common actions
    save: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    next: "Suivant",
    back: "Retour",
    complete: "Terminer",
    close: "Fermer",

    // Dashboard
    welcome: "Bon retour !",
    goodMorning: "Bonjour !",
    goodAfternoon: "Bon après-midi !",
    goodEvening: "Bonsoir !",
    quickActions: "Actions Rapides",
    recentActivity: "Activité Récente",
    dailyAffirmation: "Affirmation Quotidienne",

    // Moods
    moodSad: "Je me sens Triste",
    moodMid: "Humeur Moyenne",
    moodAmazing: "Je me sens Formidable",
    selectMood: "Sélectionnez votre humeur",
    changeMood: "Changer d'humeur",

    // Tasks
    addTask: "Ajouter une Tâche",
    completeTask: "Terminer la Tâche",
    deleteTask: "Supprimer la Tâche",
    taskCompleted: "Tâche terminée !",
    tasksRemaining: "tâches restantes",
    quickAdd: "Ajout Rapide",

    // Check-in
    dailyCheckIn: "Bilan Quotidien",
    howAreYouFeeling: "Comment vous sentez-vous ?",
    energyLevel: "Niveau d'Énergie",
    gratitude: "Gratitude",
    aiInsight: "Aperçu IA",
    checkInComplete: "Bilan terminé !",

    // Settings
    theme: "Thème",
    lightMode: "Mode Clair",
    darkMode: "Mode Sombre",
    autoMode: "Mode Automatique",
    language: "Langue",
    notifications: "Notifications",
    privacy: "Confidentialité",
    preferences: "Préférences",
    account: "Compte",

    // Time
    today: "Aujourd'hui",
    yesterday: "Hier",
    tomorrow: "Demain",
    thisWeek: "Cette Semaine",
    thisMonth: "Ce Mois",

    // Messages
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    success: "Succès !",
    noData: "Aucune donnée disponible",
  },

  de: {
    // Navigation
    home: "Startseite",
    tasks: "Aufgaben",
    journal: "Tagebuch",
    meditation: "Meditation",
    goals: "Ziele",
    friends: "Freunde",
    rewards: "Belohnungen",
    settings: "Einstellungen",
    profile: "Profil",
    help: "Hilfe",

    // Common actions
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    next: "Weiter",
    back: "Zurück",
    complete: "Abschließen",
    close: "Schließen",

    // Dashboard
    welcome: "Willkommen zurück!",
    goodMorning: "Guten Morgen!",
    goodAfternoon: "Guten Tag!",
    goodEvening: "Guten Abend!",
    quickActions: "Schnellaktionen",
    recentActivity: "Kürzliche Aktivität",
    dailyAffirmation: "Tägliche Affirmation",

    // Moods
    moodSad: "Traurig",
    moodMid: "Mittlere Stimmung",
    moodAmazing: "Fantastisch",
    selectMood: "Wählen Sie Ihre Stimmung",
    changeMood: "Stimmung ändern",

    // Tasks
    addTask: "Aufgabe hinzufügen",
    completeTask: "Aufgabe abschließen",
    deleteTask: "Aufgabe löschen",
    taskCompleted: "Aufgabe erledigt!",
    tasksRemaining: "Aufgaben verbleibend",
    quickAdd: "Schnell hinzufügen",

    // Check-in
    dailyCheckIn: "Tägliches Check-in",
    howAreYouFeeling: "Wie fühlen Sie sich?",
    energyLevel: "Energielevel",
    gratitude: "Dankbarkeit",
    aiInsight: "KI-Einblick",
    checkInComplete: "Check-in abgeschlossen!",

    // Settings
    theme: "Design",
    lightMode: "Heller Modus",
    darkMode: "Dunkler Modus",
    autoMode: "Automatischer Modus",
    language: "Sprache",
    notifications: "Benachrichtigungen",
    privacy: "Datenschutz",
    preferences: "Einstellungen",
    account: "Konto",

    // Time
    today: "Heute",
    yesterday: "Gestern",
    tomorrow: "Morgen",
    thisWeek: "Diese Woche",
    thisMonth: "Dieser Monat",

    // Messages
    loading: "Lädt...",
    error: "Ein Fehler ist aufgetreten",
    success: "Erfolg!",
    noData: "Keine Daten verfügbar",
  },

  it: {
    // Navigation
    home: "Home",
    tasks: "Attività",
    journal: "Diario",
    meditation: "Meditazione",
    goals: "Obiettivi",
    friends: "Amici",
    rewards: "Ricompense",
    settings: "Impostazioni",
    profile: "Profilo",
    help: "Aiuto",

    // Common actions
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    next: "Avanti",
    back: "Indietro",
    complete: "Completa",
    close: "Chiudi",

    // Dashboard
    welcome: "Bentornato!",
    goodMorning: "Buongiorno!",
    goodAfternoon: "Buon pomeriggio!",
    goodEvening: "Buonasera!",
    quickActions: "Azioni Rapide",
    recentActivity: "Attività Recente",
    dailyAffirmation: "Affermazione Quotidiana",

    // Moods
    moodSad: "Triste",
    moodMid: "Umore Medio",
    moodAmazing: "Fantastico",
    selectMood: "Seleziona il tuo umore",
    changeMood: "Cambia umore",

    // Tasks
    addTask: "Aggiungi Attività",
    completeTask: "Completa Attività",
    deleteTask: "Elimina Attività",
    taskCompleted: "Attività completata!",
    tasksRemaining: "attività rimanenti",
    quickAdd: "Aggiunta Rapida",

    // Check-in
    dailyCheckIn: "Check-in Quotidiano",
    howAreYouFeeling: "Come ti senti?",
    energyLevel: "Livello di Energia",
    gratitude: "Gratitudine",
    aiInsight: "Insight IA",
    checkInComplete: "Check-in completato!",

    // Settings
    theme: "Tema",
    lightMode: "Modalità Chiara",
    darkMode: "Modalità Scura",
    autoMode: "Modalità Automatica",
    language: "Lingua",
    notifications: "Notifiche",
    privacy: "Privacy",
    preferences: "Preferenze",
    account: "Account",

    // Time
    today: "Oggi",
    yesterday: "Ieri",
    tomorrow: "Domani",
    thisWeek: "Questa Settimana",
    thisMonth: "Questo Mese",

    // Messages
    loading: "Caricamento...",
    error: "Si è verificato un errore",
    success: "Successo!",
    noData: "Nessun dato disponibile",
  },
};

export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.en;
};

export const t = (key: keyof Translations, language: Language): string => {
  const translations = getTranslations(language);
  return translations[key] || key;
};
