import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORE_KEYS = {
  tasks: 'gate:tasks',
  pyqLog: 'gate:pyq_log',
  mocks: 'gate:mocks',
  formulas: 'gate:formulas',
  errors: 'gate:errors',
  weeklyReviews: 'gate:weekly_reviews',
  mastery: 'gate:mastery',
  priorityBoard: 'gate:priority_board',
  reminders: 'gate:reminders',
  milestones: 'gate:milestones',
  settings: 'gate:settings'
};

export const storage = {
  // Get all records from a store
  async get(key) {
    try {
      const data = await AsyncStorage.getItem(STORE_KEYS[key]);
      return data ? JSON.parse(data) : getDefaults(key);
    } catch (error) {
      console.error(`Storage get error (${key}):`, error);
      return getDefaults(key);
    }
  },

  // Set all records (replace entire store)
  async set(key, value) {
    try {
      await AsyncStorage.setItem(STORE_KEYS[key], JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set error (${key}):`, error);
      return false;
    }
  },

  // Add new item to array store
  async add(key, item) {
    try {
      const arr = await this.get(key);
      const newItem = { ...item, id: uuidv4() };
      arr.push(newItem);
      await this.set(key, arr);
      return newItem.id;
    } catch (error) {
      console.error(`Storage add error (${key}):`, error);
      return null;
    }
  },

  // Update item in array store by ID
  async update(key, id, changes) {
    try {
      const arr = await this.get(key);
      const idx = arr.findIndex(item => item.id === id);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...changes };
        await this.set(key, arr);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Storage update error (${key}):`, error);
      return false;
    }
  },

  // Delete item from array store by ID
  async delete(key, id) {
    try {
      const arr = await this.get(key);
      const filtered = arr.filter(item => item.id !== id);
      await this.set(key, filtered);
      return true;
    } catch (error) {
      console.error(`Storage delete error (${key}):`, error);
      return false;
    }
  },

  // Export all data as JSON
  async exportAll() {
    try {
      const allData = {};
      for (const key of Object.keys(STORE_KEYS)) {
        allData[key] = await this.get(key);
      }
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  },

  // Import data from JSON
  async importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      for (const [key, value] of Object.entries(data)) {
        if (STORE_KEYS[key]) {
          await this.set(key, value);
        }
      }
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }
};

// Initialize default data on first launch
export async function initializeDefaults() {
  const keys = Object.keys(STORE_KEYS);
  for (const key of keys) {
    const existing = await AsyncStorage.getItem(STORE_KEYS[key]);
    if (!existing) {
      const defaults = getDefaults(key);
      await AsyncStorage.setItem(STORE_KEYS[key], JSON.stringify(defaults));
    }
  }
}

// Default data for each store
function getDefaults(key) {
  switch (key) {
    case 'tasks':
    case 'pyqLog':
    case 'mocks':
    case 'errors':
    case 'weeklyReviews':
    case 'priorityBoard':
    case 'formulas':
    case 'reminders':
    case 'milestones':
      return [];
    case 'mastery':
      return getDefaultMastery();
    case 'settings':
      return {
        dailyPyqTarget: 20,
        motivationVisible: true,
        darkMode: true,
        initialized: false
      };
    default:
      return [];
  }
}

function getDefaultMastery() {
  const subjects = [
    'Networks', 'Signals & Systems', 'Engineering Mathematics',
    'Communications', 'Electromagnetics', 'Analog Circuits',
    'Digital Circuits', 'Electronic Devices', 'Control Systems', 'General Aptitude'
  ];
  
  const masteryObj = {};
  subjects.forEach(subject => {
    masteryObj[subject] = { topics: {} };
  });
  return masteryObj;
}
