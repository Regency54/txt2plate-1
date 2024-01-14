import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, Image,SafeAreaView } from 'react-native'
import Colors from '../../../Constants/Colors'
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../../utils/Routes';




const SplashScreen = () => {
const navigation = useNavigation();
  useEffect(()=>{
    let user = auth().currentUser;
    setTimeout(() => {
      if (user) {
        navigation.reset({
         index: 0,
         routes: [{name: Routes.HOME_SCREEN}],
       });
       }else{
         navigation.reset({
           index: 0,
           routes: [{name: Routes.SIGN_IN}],
         });   
        }
    }, 3000);
  },[])
  return (
    <SafeAreaView style={styles.screen}>
     <Image
     style={styles.logo}
     source={require('../../Images/logo.jpg')}
     />
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.WHITE
    },logo:{
        width:200,
        height:200  
    }
})