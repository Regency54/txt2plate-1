import React, {useState} from 'react';
import {StyleSheet, View, SafeAreaView, ScrollView, Text} from 'react-native';
import Colors from '../../../../Constants/Colors';
import AppInput from '../../../../Components/AppInput';
import AppButton from '../../../../Components/AppButton';
import {hp} from '../../../../Constants/constant';
import Routes from '../../../../utils/Routes';
import AppValidater from '../../../../helper/AppValidation';
import { AppStrings } from '../../../../utils/AppStrings';
import auth from '@react-native-firebase/auth';
import AppLoading
 from '../../../../Components/AppLoading';
 import { useNavigation } from '@react-navigation/native';
 import Toast from 'react-native-toast-message';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const ForgetPassword = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailTextError, setEmailTextError] = useState('');
  const [isLoading,setLoading] = useState(false);

  const ResetPassword = ()=>{
    if (email =='') {
      setEmailError(true);
      setEmailTextError(AppStrings.FIELD_REQUIRED);
      return;
    }else if (!AppValidater.validateEmail(email)) {
      setEmailError(true);
      setEmailTextError(AppStrings.EMAIL_ERROR);
      return;
    } else{
      setEmailError(false);
      setEmailTextError('');
    }
     if (email) {
      setLoading(true);
      auth().sendPasswordResetEmail(email)
      .then(()=>{
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password has been sent to your email address!',
        });
  
        setTimeout(() => {
          navigation.navigate(Routes.SIGN_IN)
        }, 1500);
        
  
      })
      .catch((error)=>{
        setLoading(false);
        if (error.code == 'auth/user-not-found'){
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Account not found!',
          });
        } else{
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: AppStrings.WRONG_TEXT,
          }); 
        }
       
      });
     }
  }

  const emptyFields = ()=>{
    setEmail('');
    setEmailError(false);
    setEmailTextError('');
  }

  return (
    <>
    <AppLoading
    isVisible={isLoading}
    />
      <View
    style={{height:'10%',backgroundColor:Colors.WHITE}}
    />
        <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.curve} />

        <View style={styles.centerContent}>
          <Text style={{color: Colors.BLACK, fontSize: 16, fontWeight: 'bold'}}>
            {AppStrings.APP_NAME}
          </Text>
          <Text style={{fontSize: 12, marginTop: 5}}>
            {AppStrings.LICENSE_TEXT}
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
            {` Forget Your Password :(`}
          </Text>
          <View style={{width: '100%', marginHorizontal: 20, marginBottom: 20}}>
            <Text
              style={{
                width: '90%',
                color: Colors.BLACK,
                alignSelf: 'center',
                fontFamily: fonts.sfproBold,
                fontSize: 14,
                fontStyle: 'normal',
              }}>
              {`Don't worry we are here to recover your password`}
            </Text>
          </View>
          <AppInput
            isIcon={true}
            iconName={'user'}
            iconType={'font-awesome'}
            inputContainer={styles.input}
            placeholder={'example@mail.com'}
            value={email}
            onChange={text => setEmail(text)}
            isError={emailError}
            errorText={emailTextError}
          />
          <AppButton
            textStyle={{fontSize: 14}}
            containerStyle={styles.btnContainer}
            title={'RESET PASSWORD'}
            onPress={ResetPassword}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  screen: {
    width:'100%',
    height:'90%',
    backgroundColor: Colors.PRIMARY,
  },
  input: {
    marginHorizontal: 20,
  },
  btnContainer: {
    marginBottom: hp(18),
    marginVertical: 0,
    marginTop: 10,
  },
  centerContent: {
    height: '20%',
    alignItems: 'center',
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

export default ForgetPassword;
