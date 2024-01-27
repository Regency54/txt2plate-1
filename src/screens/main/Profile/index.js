import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../../../Constants/Colors';
import AppInput from '../../../../Components/AppInput';
import AppButton from '../../../../Components/AppButton';
import auth from '@react-native-firebase/auth';
import AppLoading from '../../../../Components/AppLoading';
import firestore from '@react-native-firebase/firestore';
import {FirebaseSchema} from '../../../../Database/FirebaseSchema';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../../../utils/Routes';
import AppAlert from '../../../../Components/AppAlert';
import {AppStrings} from '../../../../utils/AppStrings';
import PasswordChangeDilalog from '../../../../Components/PasswordChangeDilalog';
import ConfirmationDialog from '../../../../Components/ConfirmationDialog';
import { launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {wp, hp} from '../../../../Constants/constant';
import storage from '@react-native-firebase/storage';


const Proile = () => {
  const navigation = useNavigation();
  const [username, setUsename] = useState();
  const [email, setEmail] = useState();
  const [country, setCountry] = useState();
  const [vehicleReg, setVehicleReg] = useState();
  const [password, setPassword] = useState();
  const inputContainerStyles = [styles.input, {marginTop: hp(10)}];
  const [isLoading, setLoading] = useState(false);
  const [isAppAlert, setAlert] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [isConfirmation, setConfirmation] = useState(false);
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [imageFromDB, setImageFromDB] = useState('');
  const [image, setImage] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const _user = auth().currentUser;
    setUser(_user);
    //console.log("User "+JSON.stringify(user))
    const subscriber = firestore()
      .collection(FirebaseSchema.user)
      .doc(user?.uid)
      .onSnapshot(documentSnapshot => {
        setLoading(false);
        if (documentSnapshot != null) {
          let data = documentSnapshot.data();
          const img = data?.img_url;
          console.log("path "+data?.img_path)
          setImage(img?img:null);
          setUsename(data?.username);
          setEmail(data?.email);
          setCountry(data?.country);
          setVehicleReg(data?.vehicle_number);
          setPassword('........');
        }
      });
    return () => subscriber();
  }, [user]);

  const deleteAccount = async () => {
    try {
      setConfirmation(false);
      setLoading(true);

      // Delete Image from Firebase Storage
      //const reference = storage().ref(`profile_pictures/${user?.img_path}`);
     const reference =  storage().refFromURL(image);
      await reference.delete();

      // Delete Firestore User Data
      await firestore().collection(FirebaseSchema.user).doc(user?.uid).delete();

      // Delete Authentication Account
      const _user = auth().currentUser;
      await _user.delete()
      .then(()=>{
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Deleted!',
          text2: 'Account deleted successfully!',
        });
  
        setTimeout(() => {
          navigation.navigate(Routes.SIGN_IN);
        }, 1500);
      })
      .catch((error)=>{
        setLoading(false);
        console.log('Error deleting account:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete account or associated data',
        });
      })
     
    } catch (error) {
      setLoading(false);
      console.error('Error deleting account:', error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete account or associated data',
      });
    }
  };
  const onClose = () => {
    setPasswordDialog(false);
  };
  const generateUniqueFilename = () => {
    console.log("generateUniqueFilename running");
    const timestamp = new Date().getTime();
    return `image_${timestamp}.jpg`;
  };
  const getDownloadURL = async imageName => {
    console.log('getDownloadURL running');
    const reference = storage().ref(`profile_pictures/${imageName}`);
    try {
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      setLoading(false);
      console.error('Error getting download URL: ', error);
      return null;
    }
  };
  const uploadImageToFirebase = async uri => {
    console.log('uploadImageToFirebase running');
    const imageName = generateUniqueFilename();
    const reference = storage().ref(`profile_pictures/${imageName}`);
    //console.log('Reference: ', reference);
   // console.log('imageName: ', imageName);
    try {
      await reference.putFile(uri);
      console.log('Image uploaded successfully!');
      const downloadURL = await getDownloadURL(imageName);
      console.log('Download URL:', downloadURL);
      const pf_data = {img_url: downloadURL, img_path: imageName};
      const dB = firestore().collection(FirebaseSchema.user).doc(user?.uid);
      dB.update(pf_data)
        .then(() => {
          console.log('Profile updated successfully!');
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Updated!',
            text2: 'Profile updated successfully!',
          });
        })
        .catch(error => {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error!',
            text2: 'Failed to update profile!',
          });
          console.log('Error ' + JSON.stringify(error));
        });
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image: ', error);
    }
  };

  const updatePicture = async () => {
    console.log('updatePicture running');
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (response.assets) {
       setLoading(true);
        const uri = response?.assets[0]?.uri;
        setImage(uri);
         await uploadImageToFirebase(uri);

      }
    });
  };

  return (
    <>
      {isConfirmation ? (
        <ConfirmationDialog
          isVisible={isConfirmation}
          onPress1={() => {
            setConfirmation(false);
          }}
          onPress2={deleteAccount}
          content={'Are you sure you want to delete an account?'}
        />
      ) : null}
      {isLoading ? <AppLoading isVisible={isLoading} /> : null}
      {isAppAlert ? (
        <AppAlert title={'Error'} content={AppStrings.TOC_ERROR} isButton={true} />
      ) : null}
      {passwordDialog ? (
        <PasswordChangeDilalog isVisible={passwordDialog} onClose={onClose} />
      ) : null}
      <SafeAreaView style={styles.Screen}>
        <TouchableOpacity onPress={updatePicture} style={{padding: 20}}>
          <Image
            style={styles.pf}
            source={image ? {uri: image} : require('../../../Images/pf.jpg')}
          />
        </TouchableOpacity>
        <ScrollView>
          {/* <Text style={styles.heading}>Proile Information</Text> */}

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'user'}
            iconType={'font-awesome'}
            placeholder={'Username'}
            value={username}
            onChange={text => setUsename(text)}
            editAble={false}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'mail'}
            iconType={'entypo'}
            placeholder={'example@mail.com'}
            value={email}
            onChange={text => setEmail(text)}
            editAble={false}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'flag'}
            iconType={'font-awesome'}
            placeholder={'United Kingdom'}
            isDropdown={true}
            value={country}
            onChange={text => setCountry(text)}
            editAble={false}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'user'}
            iconType={'font-awesome'}
            placeholder={'Vehicle Registerration'}
            value={vehicleReg}
            onChange={text => setVehicleReg(text)}
            editAble={false}
          />

          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'lock'}
            iconType={'font-awesome'}
            placeholder={'Password'}
            value={password}
            onChange={text => setPassword(text)}
            secureTextEntry={true}
            editAble={false}
            isText={true}
            textBtn={'Change'}
            onBtnPress={() => {
              setPasswordDialog(true);
            }}
          />
          <AppButton
            title={'Delete Account'}
            containerStyle={styles.btnContainer}
            onPress={() => {
              setConfirmation(true);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Proile;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.BLACK,
    alignSelf: 'center',
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: hp(1),
  },
  btnContainer: {
    alignSelf: 'center',
    marginTop: hp(4),
  },
  pf: {
    width: wp(30),
    height: hp(15),
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 80,
    resizeMode: 'cover',
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    bottom: '18%',
    position: 'absolute',
    zIndex: 1,
  },
});
