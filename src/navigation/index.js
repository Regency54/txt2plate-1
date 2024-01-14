import  React,{useState,useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from '../../utils/Routes';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import ForgetPassword from '../screens/auth/ForgotPassword';
import HomeScreen from '../screens/main/HomeScreen';
import TermsConditions from '../screens/main/TermsConditions';
import Proile from '../screens/main/Profile';
import SplashScreen from '../screens/SplashScreen';
import Colors from '../../Constants/Colors';


const Stack = createNativeStackNavigator();

export default Navigation = () => {
  const [initialRoute,setInitialRoute] = useState(Routes.SIGN_IN);

  // useEffect(()=>{
  //  let user = auth().currentUser;
  //  if (user) {
  //   setInitialRoute(Routes.HOME_SCREEN)
  //  }else{
  //   setInitialRoute(Routes.SIGN_IN);
  //  }
  // },[]);
  
  return (
    <>
    
      <StatusBar backgroundColor={Colors.WHITE} barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={Routes.SPLASH}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={Routes.SPLASH} component={SplashScreen} />
          <Stack.Screen name={Routes.SIGN_IN} component={SignIn} />
          <Stack.Screen name={Routes.SIGN_UP} component={SignUp} />
          <Stack.Screen name={Routes.FORGOT_PASSWORD} component={ForgetPassword} />
          <Stack.Screen name={Routes.HOME_SCREEN} component={HomeScreen} />
          <Stack.Screen name={Routes.PROFILE} component={Proile} />
          <Stack.Screen name={Routes.TERMS_CONDITIONS} component={TermsConditions} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
