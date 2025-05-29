import { APP_CONFIG, BATCH_NUMBER_FORMAT } from '../config/appConfig';

// Utilitaires de formatage des dates
export const formatDate = (date, format = APP_CONFIG.FORMATS.DATE_FORMAT) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  switch (format) {
    case 'dd/MM/yyyy':
      return d.toLocaleDateString('fr-FR');
    case 'dd/MM/yyyy HH:mm':
      return d.toLocaleString('fr-FR');
    case 'HH:mm':
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    default:
      return d.toLocaleDateString('fr-FR');
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, APP_CONFIG.FORMATS.DATETIME_FORMAT);
};

export const formatTime = (date) => {
  return formatDate(date, APP_CONFIG.FORMATS.TIME_FORMAT);
};

// Utilitaire pour calculer la durée entre deux dates
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  return diffMinutes;
};

// Formatage de la durée en heures et minutes
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

// Génération de numéro de lot
export const generateBatchNumber = (productCode, date = new Date(), sequence = 1) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  const dateStr = `${year}${month}${day}`;
  const seqStr = sequence.toString().padStart(BATCH_NUMBER_FORMAT.SEQUENCE_LENGTH, '0');
  
  return `${productCode}-${dateStr}-${seqStr}`;
};

// Validation d'email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation de code produit
export const isValidProductCode = (code) => {
  // Format: PROD suivi de 3 chiffres (PROD001)
  const codeRegex = /^PROD\d{3}$/;
  return codeRegex.test(code);
};

// Formatage des nombres
export const formatNumber = (number, decimals = APP_CONFIG.FORMATS.NUMBER_DECIMAL_PLACES) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return Number(number).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Formatage des pourcentages
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return `${Number(value).toFixed(decimals)}%`;
};

// Calcul de variance entre deux valeurs
export const calculateVariance = (actual, expected) => {
  if (!expected || expected === 0) return 0;
  
  const variance = ((actual - expected) / expected) * 100;
  return Math.round(variance * 10) / 10; // Arrondi à 1 décimale
};

// Utilitaires de couleur basés sur des seuils
export const getVarianceColor = (variance, theme = 'light') => {
  const absVariance = Math.abs(variance);
  
  if (absVariance <= 2) return theme === 'light' ? '#4caf50' : 'success.main';
  if (absVariance <= 5) return theme === 'light' ? '#ff9800' : 'warning.main';
  return theme === 'light' ? '#f44336' : 'error.main';
};

export const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 95) return 'success.main';
  if (efficiency >= 90) return 'success.light';
  if (efficiency >= 80) return 'warning.main';
  if (efficiency >= 70) return 'warning.light';
  return 'error.main';
};

// Utilitaires de validation
export const validateRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// Utilitaires de tri
export const sortByProperty = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const sortByDate = (array, dateProperty, direction = 'desc') => {
  return [...array].sort((a, b) => {
    const aDate = new Date(a[dateProperty]);
    const bDate = new Date(b[dateProperty]);
    
    return direction === 'desc' ? bDate - aDate : aDate - bDate;
  });
};

// Utilitaires de filtrage
export const filterBySearchTerm = (array, searchTerm, searchProperties) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    searchProperties.some(prop => {
      const value = item[prop];
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

export const filterByDateRange = (array, dateProperty, startDate, endDate) => {
  if (!startDate && !endDate) return array;
  
  return array.filter(item => {
    const itemDate = new Date(item[dateProperty]);
    
    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;
    
    return true;
  });
};

// Utilitaires de groupement
export const groupBy = (array, property) => {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

// Utilitaires de calcul statistique
export const calculateAverage = (array, property) => {
  if (!array.length) return 0;
  
  const sum = array.reduce((acc, item) => acc + (Number(item[property]) || 0), 0);
  return sum / array.length;
};

export const calculateSum = (array, property) => {
  return array.reduce((acc, item) => acc + (Number(item[property]) || 0), 0);
};

export const calculateMin = (array, property) => {
  if (!array.length) return 0;
  
  return Math.min(...array.map(item => Number(item[property]) || 0));
};

export const calculateMax = (array, property) => {
  if (!array.length) return 0;
  
  return Math.max(...array.map(item => Number(item[property]) || 0));
};

// Utilitaires de session
export const isSessionExpired = () => {
  const timestamp = localStorage.getItem('loginTimestamp');
  if (!timestamp) return true;
  
  const loginTime = new Date(timestamp);
  const now = new Date();
  const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
  
  return hoursDiff >= APP_CONFIG.AUTH.SESSION_DURATION;
};

export const getRemainingSessionTime = () => {
  const timestamp = localStorage.getItem('loginTimestamp');
  if (!timestamp) return 0;
  
  const loginTime = new Date(timestamp);
  const now = new Date();
  const elapsedHours = (now - loginTime) / (1000 * 60 * 60);
  const remainingHours = APP_CONFIG.AUTH.SESSION_DURATION - elapsedHours;
  
  return Math.max(0, remainingHours * 60); // retourne les minutes restantes
};

// Utilitaires de fichiers
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const isImageFile = (filename) => {
  const extension = getFileExtension(filename);
  return APP_CONFIG.FILES.IMAGES_EXTENSIONS.includes(extension);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utilitaires de performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilitaires de localStorage avec gestion d'erreurs
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Erreur localStorage setItem:', error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur localStorage getItem:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erreur localStorage removeItem:', error);
    return false;
  }
};

// Utilitaires de génération d'IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Utilitaires de deep clone
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
};

// Utilitaires de manipulation d'arrays
export const removeDuplicates = (array, property = null) => {
  if (!property) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[property];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Utilitaires de conversion
export const toSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9 -]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim('-'); // Supprime les tirets en début/fin
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

// Export par défaut avec toutes les fonctions
export default {
  // Dates et temps
  formatDate,
  formatDateTime,
  formatTime,
  calculateDuration,
  formatDuration,
  
  // Validation
  isValidEmail,
  isValidProductCode,
  validateRange,
  validateRequired,
  validateMinLength,
  
  // Formatage
  formatNumber,
  formatPercentage,
  calculateVariance,
  
  // Couleurs et themes
  getVarianceColor,
  getEfficiencyColor,
  
  // Tri et filtrage
  sortByProperty,
  sortByDate,
  filterBySearchTerm,
  filterByDateRange,
  groupBy,
  
  // Calculs statistiques
  calculateAverage,
  calculateSum,
  calculateMin,
  calculateMax,
  
  // Session
  isSessionExpired,
  getRemainingSessionTime,
  
  // Fichiers
  getFileExtension,
  isImageFile,
  formatFileSize,
  
  // Performance
  debounce,
  throttle,
  
  // Storage
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  
  // Utilitaires généraux
  generateId,
  generateUUID,
  deepClone,
  removeDuplicates,
  chunkArray,
  toSlug,
  capitalizeFirst,
  capitalizeWords,
  generateBatchNumber,
};