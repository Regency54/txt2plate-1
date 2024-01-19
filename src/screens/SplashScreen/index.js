import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Image, SafeAreaView} from 'react-native';
import Colors from '../../../Constants/Colors';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../../utils/Routes';
import firestore from '@react-native-firebase/firestore';
import StorageService from '../../../utils/StorageService';
import {FirebaseSchema} from '../../../Database/FirebaseSchema';

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    let user = auth().currentUser;
    const subscriber = firestore().collection(FirebaseSchema.user);
    if (user) {
      subscriber.doc(user?.uid).onSnapshot(documentSnapshot => {
        if (documentSnapshot != null) {
          let data = documentSnapshot.data();
          let userData = {
            username: data?.username,
            email: data?.email,
            country: data?.country,
            vehicle_number: data?.vehicle_number,
            img_url: data?.img_url,
            uid: user?.uid,
          };
          StorageService.setItem(FirebaseSchema.user, userData)
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{name: Routes.HOME_SCREEN}],
              });
            })
            .catch(error => {
              console.error('Error saving object:', error);
            });
        }
      });
    } else {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: Routes.SIGN_IN}],
        });
      }, 3000);
    }

    return () => subscriber();
  }, []);
  return (
    <SafeAreaView style={styles.screen}>
      <Image style={styles.logo} source={require('../../Images/logo.jpg')} />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
