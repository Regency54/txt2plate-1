import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Set an item in AsyncStorage
  static async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log("ob saved successfully");
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  }
    // Set an item in AsyncStorage
    static async setTextItem(key, value) {
      try {
        await AsyncStorage.setItem(key, String(value));
      } catch (error) {
        console.error('Error setting item in AsyncStorage:', error);
      }
    }

  // Get an item from AsyncStorage
  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  }

    // Get an item from AsyncStorage
    static async getTextItem(key) {
      try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? value : null;
      } catch (error) {
        console.error('Error getting item from AsyncStorage:', error);
        return null;
      }
    }

  // Remove an item from AsyncStorage
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  }
}

export default StorageService;
