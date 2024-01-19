import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Colors from '../../../../Constants/Colors';
import AppButton from '../../../../Components/AppButton';
import AppInput from '../../../../Components/AppInput';
import fonts from '../../../../Constants/fonts';
import {hp} from '../../../../Constants/constant';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../../../utils/Routes';
import AppValidater from '../../../../helper/AppValidation';
import {AppStrings} from '../../../../utils/AppStrings';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import AppLoading from '../../../../Components/AppLoading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState('');
  const [passErrorText, setPassErrorText] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const SignIn = () => {
    if (password == '') {
      setPassError(true);
      setPassErrorText(AppStrings.FIELD_REQUIRED);
    } else {
      setPassError(false);
      setPassErrorText('');
    }
    if (email == '') {
      setEmailError(true);
      setErrorText(AppStrings.FIELD_REQUIRED);
    } else if (!AppValidater.validateEmail(email)) {
      setEmailError(true);
      setErrorText(AppStrings.EMAIL_ERROR);
    } else {
      setEmailError(false);
      setErrorText('');
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          setLoading(false);
          console.log("res "+JSON.stringify(res))
          console.log("emailVerified "+res?.user?.emailVerified)
          let isUserVerified = res?.user?.emailVerified;
          if (isUserVerified) {
          setLoading(false);
          setEmailError(false);
          setPassError(false);
          setErrorText('');
          setEmail('');
          setPassword('');
          navigation.navigate(Routes.HOME_SCREEN); 
          } else{
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Please verify email address before login!',
            });
          }
         
        })
        .catch(error => {
          setLoading(false);
          console.log("error "+error.code)
          if (error.code == 'auth/user-not-found'
          || error.code == 'auth/wrong-password'
          || error.code == 'auth/invalid-credential'
        
          ) {
           Alert.alert('Error',AppStrings.CREDENTIALS_EEOR)
            return
          }
          if (error.code==='auth/too-many-requests') {
            Alert.alert('Error',AppStrings.BLOCK_DESIVCE);
            return
          }
          Alert.alert('Error', AppStrings.WRONG_TEXT);
          console.error(error);
        
        });
    }
  };

  const emptyFields = () => {
    setEmailError(false);
    setPassError(false);
    setErrorText('');
    setPassErrorText('');
    setEmail('');
    setPassword('');
  };
  return (
    <>
      <AppLoading isVisible={isLoading} />
      <View style={{height: '10%', backgroundColor: Colors.WHITE}} />
      <SafeAreaView style={styles.screen}>
        <KeyboardAwareScrollView>
          <View style={styles.curve} />
          <View style={styles.centerContent}>
            <Text
              style={{color: Colors.BLACK, fontSize: 16, fontWeight: 'bold'}}>
              {AppStrings.APP_NAME}
            </Text>
            <Text style={{fontSize: 12, marginTop: 5}}>
              Tag that license plate now and get them noticed!
            </Text>
            <AppButton
              textStyle={{
                fontWeight: 'normal',
                fontSize: 14,
              }}
              containerStyle={styles.btnContainer2}
              title={'SIGN UP'}
              onPress={() => {
                emptyFields();
                navigation.navigate(Routes.SIGN_UP);
              }}
            />
          </View>
          <View style={styles.scrollContentContainer}>
            <Text
              style={{
                color: Colors.BLACK,
                fontWeight: 'bold',
                fontSize: 25,
                marginBottom: 5,
                marginTop: hp(10),
              }}>
              {` Welcome Back :)`}
            </Text>
            <View
              style={{
                marginBottom: 20,
              }}>
              <Text
                style={{
                  width: '90%',
                  color: Colors.BLACK,
                  alignSelf: 'center',
                  fontFamily: fonts.sfproBold,
                  fontSize: 14,
                  fontStyle: 'normal',
                }}>
                {AppStrings.LOGIN_TEXT}
              </Text>
            </View>
            <AppInput
              isIcon={true}
              iconName={'user'}
              iconType={'font-awesome'}
              inputContainer={styles.input}
              placeholder={'Email'}
              value={email}
              onChange={text => setEmail(text)}
              isError={emailError}
              errorText={errorText}
              cap={'none'}
            />
            <AppInput
              isIcon={true}
              iconName={'lock'}
              iconType={'font-awesome'}
              inputContainer={styles.input}
              placeholder={'Password'}
              value={password}
              onChange={text => setPassword(text)}
              isError={passError}
              errorText={passErrorText}
              secureTextEntry={true}
              cap={'none'}

            />
            <View>
              <AppButton
                containerStyle={styles.btnContainer}
                title={'Login'}
                onPress={SignIn}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                emptyFields();
                navigation.navigate(Routes.FORGOT_PASSWORD);
              }}
              style={styles.fogotContainer}>
              <Text style={{color: Colors.BLACK}}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '90%',
    backgroundColor: Colors.PRIMARY,
  },
  input: {
    marginHorizontal: 20,
  },
  btnContainer: {
    marginBottom: 5,
    marginVertical: 0,
    marginTop: 10,
    justifyContent: 'center',
  },
  fogotContainer: {
    marginBottom: 40,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: hp(10),
  },
  btnContainer2: {
    height: hp(4),
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  curve: {
    ...StyleSheet.absoluteFillObject,
    height: '40%',
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    backgroundColor: Colors.WHITE,
  },
  scrollContentContainer: {
    marginTop: hp(15),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
