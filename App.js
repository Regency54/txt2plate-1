import React, {useEffect} from 'react';
import Navigation from './src/navigation';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import StorageService from './utils/StorageService';
import {PermissionsAndroid,Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';


import 'react-native-gesture-handler';

const App = () => {

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }
  const getToken = async () => {
    try {
      const _token = await messaging().getToken();
      console.log("Token:", _token);
  
      const token = await StorageService.getItem('token');
      if (!token) {
        await StorageService.setItem('token', { token: _token });
        console.log('Token saved successfully');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    if (Platform.OS=='android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    }

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  }

  useEffect(() => {
    // if (Platform.OS === 'ios') {
    //   registerAppWithFCM();
    // }
    PushNotification.createChannel(
      {
        channelId: 'channel-id-1',
        channelName: 'Your Channel Name',
        channelDescription: 'Your Channel Description',
        importance: 4,
        vibrate: true,
        smallIcon: "ic_launcher",
    
      },
      (created) => console.log(`Channel created: ${created}`),
    );
      
    requestUserPermission();
    getToken();
  }, []);

  // for foreground 
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      if (Platform.OS=='android') {
        PushNotification.localNotification({
          channelId : "channel-id-1",
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        }); 
      } else {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId,
          body: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          userInfo: remoteMessage.data,
        });
      }
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



  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
};

export default App;
