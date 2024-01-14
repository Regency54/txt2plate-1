import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import Colors from '../../../../Constants/Colors';
import AppInput from '../../../../Components/AppInput';
import AppButton from '../../../../Components/AppButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import CheckBox from 'react-native-check-box';
import {hp} from '../../../../Constants/constant';
import Routes from '../../../../utils/Routes';
import {useNavigation} from '@react-navigation/native';
import {AppStrings} from '../../../../utils/AppStrings';
import AppValidater from '../../../../helper/AppValidation';
import firestore from '@react-native-firebase/firestore';
import {FirebaseSchema} from '../../../../Database/FirebaseSchema';
import AppLoading from '../../../../Components/AppLoading';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import AppDropdown from '../../../../Components/AppDropdown';
import AppAlert from '../../../../Components/AppAlert';




const SignUp = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const curveHeight = screenHeight * 0.4;
  const navigation = useNavigation('');
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsename] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [vehicleReg, setVehicleReg] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLicense, setSelectedLicense] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);



  // booleans
  const [usernameError, setUsenameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [tocError, setTocError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [vError, setVerror] = useState(false);
  const [passError, setPassError] = useState(false);
  const [cPassError, setCpassError] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  // string errors for each
  const [usernameTextError, setUsenameTextError] = useState('');
  const [emailTextError, setEmailTextError] = useState('');
  const [tocTextError, setTocTextError] = useState('');
  const [countryTextError, setCountryTextError] = useState('');
  const [vTextError, setTextVerror] = useState('');
  const [passTextError, setTextPassError] = useState('');
  const [cPassTextError, setCpassTextError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isAppAlert, setAlert] = useState(false);
  const [alertText,setAlertText] = useState('');
  const [errorType,setErrorType] = useState('');
  const [alertTitle,setTitle] =useState('');


  const handleSelectedLicense = item => {
    setSelectedLicense(item.value);
  };
  const alertEvent = ()=>{
    setAlert(false);
    if (errorType=='1') {
      setIsChecked(true);
      navigation.navigate(Routes.TERMS_CONDITIONS)
    } else if(errorType == '3'){
       navigation.navigate(Routes.SIGN_IN);
    }

  }
  const SignUp = () => {
    if (username == '') {
      setUsenameError(true);
      setUsenameTextError(AppStrings.FIELD_REQUIRED);
    } else {
      setUsenameError(false);
      setUsenameTextError('');
    }
    if (email == '') {
      setEmailError(true);
      setEmailTextError(AppStrings.FIELD_REQUIRED);
    } else if (!AppValidater.validateEmail(email)) {
      setEmailError(true);
      setEmailTextError(AppStrings.EMAIL_ERROR);
    } else {
      setEmailError(false);
      setEmailTextError('');
    }
    if (country == '') {
      setCountryError(true);
      setCountryTextError(AppStrings.FIELD_REQUIRED);
    } else {
      setCountryError(false);
      setCountryTextError('');
    }
    if (vehicleReg == '') {
      setVerror(true);
      setTextVerror(AppStrings.FIELD_REQUIRED);
    } else {
      setVerror(false);
      setTextVerror('');
    }

    if (password === '') {
      setPassError(true);
      setTextPassError(AppStrings.FIELD_REQUIRED);
      return;
    } else if (password.length < 6) {
      setPassError(true);
      setTextPassError(AppStrings.PASSWORD_ERROR);
      return
    } else if (confirmPassword === '') {
      setCpassError(true);
      setCpassTextError(AppStrings.FIELD_REQUIRED);
      return
    } else if (password !== confirmPassword) {
      setPassError(true);
      setTextPassError(AppStrings.PASSWORD_ERROR);
      setCpassError(true);
      setCpassTextError(AppStrings.PASSWORD_ERROR);
      return
    } else {
      setPassError(false);
      setCpassError(false);
      setTextPassError('');
      setCpassTextError('');
    }

    if (!isChecked) {
      setTitle('Error')
      setErrorType('1')
      setAlertText(AppStrings.TOC_ERROR)
      setAlert(true);
      return;
    }
    if (username && email && country && vehicleReg && password) {
     try {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          let userId = res?.user?.uid;
          // firestore
          const usersCollection = firestore()
            .collection(FirebaseSchema.user)
            .doc(userId);
          const userData = {
            uid: userId,
            username: username,
            email: email.toLowerCase(),
            country: country,
            vehicl_number: vehicleReg,
          };
          usersCollection
            .set(userData)
            .then(() => {
              auth()
              .currentUser
              .sendEmailVerification()
              .then(()=>{
                setLoading(false);
                setTitle('Success')
                setAlert(true);
                setErrorType('3');
                setAlertText(AppStrings.EMAIL_VERFICATION_TEXT)
              })
              .catch((error)=>{
                setLoading(false);
                setAlert(true);
                setErrorType('0');
                setAlertText(AppStrings.EMAIL_VERFICATION_TEXT);
                console.log("email verification error "+JSON.stringify(error));
              });
            })
            .catch(error => {
              setLoading(false);
              setTitle('Error')
              setErrorType('0')
              setAlert(true);
              setAlertText(AppStrings.WRONG_TEXT)
              console.error('Error adding data to user document:', error);
            });
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'That email address is already in use!',
              });
            }
            if (error.code === 'auth/invalid-email') {
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'That email address is invalid!',
              });
            }
            if (error.code === 'auth/weak-password') {
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password must be at least 6 characters',
              });
            }
          });
     } catch (error) {
       console.log("Error "+error)
     }
    }
  };

  return (
    <>
      {isAppAlert ? <AppAlert 
      title={alertTitle}
      content={alertText}
      isVisible={isAppAlert}
      onPress={alertEvent}
      /> : null}
      {isLoading?(<AppLoading isVisible={isLoading} />):null}
      <SafeAreaView style={styles.screen}>
        <ScrollView>
          <Text style={styles.title}>{`"SIGN UP HERE FOR FREE"`}</Text>
          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'user'}
            iconType={'font-awesome'}
            placeholder={'Username'}
            value={username}
            onChange={text => setUsename(text)}
            isError={usernameError}
            errorText={usernameTextError}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'mail'}
            iconType={'entypo'}
            placeholder={'example@mail.com'}
            value={email}
            onChange={text => setEmail(text)}
            isError={emailError}
            errorText={emailTextError}
            type={'email-address'}
          />
          <AppDropdown
          defaultValue={country}
          onChange={text => setCountry(text)}
          />
         

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'user'}
            iconType={'font-awesome'}
            placeholder={'Vehicle Registeration'}
            value={vehicleReg}
            onChange={text => setVehicleReg(text.toUpperCase())}
            isError={vError}
            errorText={vTextError}
            autoCapitalize= "characters"
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'lock'}
            iconType={'font-awesome'}
            placeholder={'Password'}
            value={password}
            onChange={text => setPassword(text)}
            isError={passError}
            errorText={passTextError}
            secureTextEntry={true}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'lock'}
            iconType={'font-awesome'}
            placeholder={'Confirm Password'}
            value={confirmPassword}
            onChange={text => setConfirmPassword(text)}
            isError={cPassError}
            errorText={cPassTextError}
            secureTextEntry={true}
          /> 
          <View
            style={{
              marginTop: 10,
              width: '60%',
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <CheckBox
              style={{padding: 5}}
              onClick={() => {
                if (isChecked) {
                  setIsChecked(false);
                } else {
                  setIsChecked(true);
                }
                navigation.navigate(Routes.TERMS_CONDITIONS);
              }}
              isChecked={isChecked}
              checkBoxColor={Colors.TEXT_COLOR_3}
              checkedCheckBoxColor={Colors.GREEN}
            />
            <Text style={{fontSize: 12,alignSelf:'center'}}>Terms and Conditions agreement</Text>

          </View>
          <AppButton
            textStyle={{fontSize: 14}}
            title={'REGISTER'}
            containerStyle={{alignSelf: 'center'}}
            onPress={SignUp}
          />
        </ScrollView>

        <View style={styles.bottomCurve}>
          <View style={styles.centerContent}>
            <Text
              style={{color: Colors.BLACK, fontSize: 32, fontWeight: 'bold'}}>
              {AppStrings.APP_NAME}
            </Text>
            <Text
              style={{color: Colors.BLACK, fontSize: 18, fontWeight: 'bold'}}>
              One of us?
            </Text>
            <Text style={{fontSize: 12, marginTop: 5}}>
              Login with your email and password :D
            </Text>
            <AppButton
              textStyle={{
                fontWeight: 'normal',
                fontSize: 14,
              }}
              containerStyle={styles.btnContainer2}
              title={'SIGN IN'}
              onPress={() => {
                navigation.navigate(Routes.SIGN_IN);
              }}
            />
          </View>
        </View>
       {Platform.OS == 'ios' ?  <View
        style={{
          backgroundColor: Colors.WHITE,
          width: '100%',
          height:'10%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}/>: null}
      </SafeAreaView>
      

    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.BLACK,
    alignSelf: 'center',
    marginTop: hp(12),
  },
  input: {
    marginHorizontal: 20,
  },
  centerContent: {
    alignItems: 'center',
    transform: [{scaleX: 0.8}],
  },
  btnContainer2: {
    height: hp(4),
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BLACK,
    borderWidth: 1.5,
    marginVertical: 8,
    transform: [{scaleX: 0.7}],
  },
  bottomCurve: {
    height: '22%',
    transform: [{scaleX: 1.5}],
    borderTopStartRadius: 200,
    borderTopEndRadius: 200,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    backgroundColor: Colors.WHITE,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    width:'100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
