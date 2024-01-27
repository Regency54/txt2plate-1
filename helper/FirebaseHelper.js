const dBPath = "";
const profileStoragePath = "";
import { AppStrings } from "../utils/AppStrings";

class FirebaseHelper {

    
    static getDatabase() {
        return firebase.database();
    }

    static uploadImage(uri) {
        
    }
    
   getDownloadURL = async (imageName) => {
    const reference = storage().ref(`profile_pictures/${imageName}`);
    try {
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error getting download URL: ', error);
      return null;
    }
  };


   generateUniqueFilename = () => {
    const timestamp = new Date().getTime();
    return `image_${timestamp}.jpg`;
  };

  // push notifiactions notification
   static sendNotification = async (notificationData) => {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${AppStrings.FCM_SERVER_KEY}`,
        },
        body: JSON.stringify(notificationData),
      });
  
      const responseData = await response.json();
  
      console.log('Notification sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  };

  };

export default FirebaseHelper;