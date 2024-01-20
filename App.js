import React, {useEffect} from 'react';
import Navigation from './src/navigation';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import StorageService from './utils/StorageService';
import 'react-native-gesture-handler';

const App = () => {
  const getToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const _token = await messaging().getToken();
    const token = await StorageService.getItem('token');
    if (!token) {
      await StorageService.setItem('token', {token: _token});
      console.log('token saved successfully');
    }
    console.log('token id', _token);
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Register background handler
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      },
    );
    return unsubscribe;
  }, []);


  useEffect(() => {
    getToken();
  }, []);
  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
};

export default App;
