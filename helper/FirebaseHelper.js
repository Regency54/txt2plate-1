const dBPath = "";
const profileStoragePath = "";

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

}

export default FirebaseHelper;