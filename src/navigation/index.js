import  React,{useState,useEffect} from 'react';
import Routes from '../../utils/Routes';
import {StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import ForgetPassword from '../screens/auth/ForgotPassword';
import HomeScreen from '../screens/main/HomeScreen';
import TermsConditions from '../screens/main/TermsConditions';
import Proile from '../screens/main/Profile';
import SplashScreen from '../screens/SplashScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import SentMessagesScreen from '../screens/main/SentMessagesScreen';
import Colors from '../../Constants/Colors';
import AppDrawer from '../../Components/AppDrawer';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


function DrawerStack() {
  return (
    <Drawer.Navigator
      drawerContent={props => <AppDrawer {...props} />}
      initialRouteName={Routes.HOME_SCREEN}
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name={Routes.HOME_SCREEN} component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default Navigation = () => {
  const [initialRoute,setInitialRoute] = useState(Routes.SIGN_IN);
  
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
          <Stack.Screen name={Routes.HOME_SCREEN} component={HomeScreen} />
          <Stack.Screen name={Routes.SIGN_IN} component={SignIn} />
          <Stack.Screen name={Routes.SIGN_UP} component={SignUp} />
          <Stack.Screen name={Routes.FORGOT_PASSWORD} component={ForgetPassword} />
          <Stack.Screen name={Routes.PROFILE} component={Proile} />
          <Stack.Screen name={Routes.INBOX} component={MessagesScreen} />
          <Stack.Screen name={Routes.SENT} component={SentMessagesScreen} />
          <Stack.Screen name={Routes.TERMS_CONDITIONS} component={TermsConditions} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
