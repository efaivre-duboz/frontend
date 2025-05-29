// Configuration générale de l'application
export const APP_CONFIG = {
  // Informations générales
  APP_NAME: 'Production Management System',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Système de gestion de production industrielle',
  
  // Configuration API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  API_TIMEOUT: 30000, // 30 secondes
  
  // Configuration d'authentification
  AUTH: {
    SESSION_DURATION: 8, // heures
    AUTO_LOGOUT_WARNING: 15, // minutes avant expiration
    REMEMBER_ME_DURATION: 30, // jours
  },
  
  // Configuration de pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
    MAX_PAGE_SIZE: 100,
  },
  
  // Configuration des fichiers
  FILES: {
    MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    IMAGES_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
  
  // Configuration des notifications
  NOTIFICATIONS: {
    AUTO_HIDE_DURATION: 5000, // 5 secondes
    MAX_NOTIFICATIONS: 3,
  },
  
  // Configuration du cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    DASHBOARD_REFRESH_INTERVAL: 30 * 1000, // 30 secondes
  },
  
  // Limites de l'application
  LIMITS: {
    MAX_BATCH_QUANTITY: 10000,
    MIN_BATCH_QUANTITY: 1,
    MAX_INGREDIENTS_PER_PRODUCT: 20,
    MAX_QUALITY_TESTS_PER_PRODUCT: 15,
    MAX_PRODUCTION_TIME_HOURS: 24,
  },
  
  // Configuration des formats
  FORMATS: {
    DATE_FORMAT: 'dd/MM/yyyy',
    DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
    TIME_FORMAT: 'HH:mm',
    CURRENCY_FORMAT: '€',
    NUMBER_DECIMAL_PLACES: 2,
  },
};

// Configuration des rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
};

// Permissions par rôle
export const PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'dashboard.view',
    'production.scan',
    'production.manage',
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'batches.view',
    'batches.manage',
    'reports.view',
    'reports.export',
    'users.manage',
    'settings.manage',
  ],
  [USER_ROLES.OPERATOR]: [
    'dashboard.view',
    'production.scan',
    'production.execute',
    'batches.view_own',
  ],
};

// Configuration des statuts
export const BATCH_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const BATCH_STATUS_LABELS = {
  [BATCH_STATUS.IN_PROGRESS]: 'En cours',
  [BATCH_STATUS.COMPLETED]: 'Terminé',
  [BATCH_STATUS.REJECTED]: 'Rejeté',
  [BATCH_STATUS.CANCELLED]: 'Annulé',
};

export const PRODUCTION_STEPS = {
  RECIPE: 'recipe',
  INGREDIENTS: 'ingredients',
  QUALITY_CONTROL: 'quality_control',
  COMPLETING: 'completing',
  COMPLETED: 'completed',
};

export const PRODUCTION_STEPS_LABELS = {
  [PRODUCTION_STEPS.RECIPE]: 'Recette & Instructions',
  [PRODUCTION_STEPS.INGREDIENTS]: 'Saisie Ingrédients',
  [PRODUCTION_STEPS.QUALITY_CONTROL]: 'Contrôle Qualité',
  [PRODUCTION_STEPS.COMPLETING]: 'Finalisation',
  [PRODUCTION_STEPS.COMPLETED]: 'Terminé',
};

// Configuration des tests qualité
export const QUALITY_TEST_TYPES = {
  NUMBER: 'number',
  SELECT: 'select',
  BOOLEAN: 'boolean',
  TEXT: 'text',
};

export const QUALITY_TEST_TYPES_LABELS = {
  [QUALITY_TEST_TYPES.NUMBER]: 'Numérique (plage de valeurs)',
  [QUALITY_TEST_TYPES.SELECT]: 'Sélection (liste d\'options)',
  [QUALITY_TEST_TYPES.BOOLEAN]: 'Oui/Non (conforme/non conforme)',
  [QUALITY_TEST_TYPES.TEXT]: 'Texte libre',
};

export const TEST_STATUS = {
  PENDING: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
};

export const TEST_STATUS_LABELS = {
  [TEST_STATUS.PENDING]: 'En attente',
  [TEST_STATUS.PASSED]: 'Conforme',
  [TEST_STATUS.FAILED]: 'Non conforme',
};

// Configuration des couleurs de statut
export const STATUS_COLORS = {
  [BATCH_STATUS.IN_PROGRESS]: 'warning',
  [BATCH_STATUS.COMPLETED]: 'success',
  [BATCH_STATUS.REJECTED]: 'error',
  [BATCH_STATUS.CANCELLED]: 'default',
  [TEST_STATUS.PENDING]: 'default',
  [TEST_STATUS.PASSED]: 'success',
  [TEST_STATUS.FAILED]: 'error',
};

// Configuration des niveaux de sévérité
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.LOW]: 'info',
  [SEVERITY_LEVELS.MEDIUM]: 'warning',
  [SEVERITY_LEVELS.HIGH]: 'error',
  [SEVERITY_LEVELS.CRITICAL]: 'error',
};

// Configuration par défaut des produits
export const DEFAULT_PRODUCT_CONFIG = {
  status: 'active',
  recipe: {
    instructions: '',
    estimatedTime: 30,
    difficulty: 'Moyen',
    ingredients: [],
    equipment: [],
    safetyNotes: [],
  },
  qualityTests: [],
};

// Configuration des difficulty levels
export const DIFFICULTY_LEVELS = ['Facile', 'Moyen', 'Difficile'];

// Configuration des unités de mesure courantes
export const MEASUREMENT_UNITS = [
  'ml', 'L', 'g', 'kg', 'mg', 'µg',
  'pcs', 'units', 'drops', 'tsp', 'tbsp',
  '°C', 'pH', '%', 'ppm', 'cP'
];

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur interne',
  VALIDATION_ERROR: 'Erreur de validation des données',
  SESSION_EXPIRED: 'Session expirée, veuillez vous reconnecter',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
};

// Messages de succès standardisés
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  SAVE_SUCCESS: 'Données sauvegardées avec succès',
  DELETE_SUCCESS: 'Suppression réussie',
  UPDATE_SUCCESS: 'Mise à jour réussie',
  CREATE_SUCCESS: 'Création réussie',
  BATCH_COMPLETED: 'Lot de production terminé avec succès',
  QUALITY_TESTS_PASSED: 'Tous les tests qualité sont conformes',
};

// Configuration des routes de l'application
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PRODUCTION_SCAN: '/scan',
  PRODUCTION_RECIPE: '/production/recipe/:batchId',
  PRODUCTION_INGREDIENTS: '/production/ingredients/:batchId',
  PRODUCTION_QUALITY: '/production/quality/:batchId',
  PRODUCTION_COMPLETE: '/production/complete/:batchId',
  PRODUCTS_MANAGEMENT: '/products',
  BATCHES_MANAGEMENT: '/batches',
  REPORTS: '/reports',
  NOT_FOUND: '/404',
};

// Configuration des formats de numéros de lot
export const BATCH_NUMBER_FORMAT = {
  PATTERN: '{PRODUCT_CODE}-{YYYYMMDD}-{SEQUENCE}',
  SEQUENCE_LENGTH: 3, // 001, 002, etc.
  DATE_FORMAT: 'YYYYMMDD',
};

// Helper functions pour la configuration
export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.includes(permission) || false;
};

export const canAccessRoute = (userRole, route) => {
  const adminOnlyRoutes = [
    ROUTES.PRODUCTS_MANAGEMENT,
    ROUTES.BATCHES_MANAGEMENT,
    ROUTES.REPORTS,
  ];
  
  if (adminOnlyRoutes.includes(route)) {
    return userRole === USER_ROLES.ADMIN;
  }
  
  return true; // Autres routes accessibles à tous les utilisateurs connectés
};

export const getStatusColor = (status, type = 'batch') => {
  return STATUS_COLORS[status] || 'default';
};

export const formatBatchNumber = (productCode, date = new Date(), sequence = 1) => {
  const dateStr = date.getFullYear().toString() + 
                  (date.getMonth() + 1).toString().padStart(2, '0') + 
                  date.getDate().toString().padStart(2, '0');
  const seqStr = sequence.toString().padStart(BATCH_NUMBER_FORMAT.SEQUENCE_LENGTH, '0');
  
  return `${productCode}-${dateStr}-${seqStr}`;
};

export default {
  APP_CONFIG,
  USER_ROLES,
  PERMISSIONS,
  BATCH_STATUS,
  PRODUCTION_STEPS,
  QUALITY_TEST_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
};