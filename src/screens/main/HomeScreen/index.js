import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Colors from '../../../../Constants/Colors';
import AppButton from '../../../../Components/AppButton';
import {useNavigation} from '@react-navigation/native';
import AppLoading from '../../../../Components/AppLoading';
import Icon from '../../../../Constants/Icons';
import AppInput from '../../../../Components/AppInput';
import {AppStrings} from '../../../../utils/AppStrings';
import {hp} from '../../../../Constants/constant';
import AppDropdown from '../../../../Components/AppDropdown';
import {RadioButton} from 'react-native-paper';
import CheckBox from 'react-native-check-box';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import storage from '@react-native-firebase/storage';
import {FirebaseSchema} from '../../../../Database/FirebaseSchema';
import firestore from '@react-native-firebase/firestore';
import StorageService from '../../../../utils/StorageService';
import {useRoute} from '@react-navigation/native';
import Routes from '../../../../utils/Routes';
import FirebaseHelper from '../../../../helper/FirebaseHelper';

const HomeScreen = () => {
  const [vTextError, setTextVerror] = useState('');
  const [vError, setVerror] = useState(false);
  const [vehicleReg, setVehicleReg] = useState('');
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('');
  const [fileText, setFileText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      StorageService.getItem(FirebaseSchema.user)
      .then(retrievedObject => {
        if (retrievedObject) {
          setUser(retrievedObject);
          console.log('Retrieved object:', retrievedObject);
        } else {
          console.log('Object not found in AsyncStorage');
        }
      })
      .catch(error => {
        console.error('Error retrieving object:', error);
      });
    } catch (error) {
      console.error('Error retrieving object:', error);
 
    }
  }, []);


  useEffect(() => {
    setFileType(AppStrings.CHOOSE_FILE);
    setFileText(AppStrings.NO_FILE_SELECTED);
  }, []);

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
        //setLoading(true);
        const uri = response?.assets[0]?.uri;
        setImage(uri);
        setFileText('Selected');
        setFileType('Change');
        // await uploadImageToFirebase(uri);
      }
    });
  };

  const emptyFields = () => {
    setLoading(false);
    setIsChecked(false);
    setVehicleReg('');
    setCountry('United Kingdom');
    setMessage('');
    setImage(null);
    setFileType('Choose file');
    setFileText('no file selected');
  };

  const sendNotification = ()=>{
    firestore().collection(FirebaseSchema.user)
    .where('vehicle_number', '==', vehicleReg)
    .onSnapshot(querySnapshot => {
      if (querySnapshot.empty) {
        setLoading(false);
        console.log("Empty querySnapshot");
        return
      }
      querySnapshot.forEach(doc => {
        console.log(doc.data().token);
        const notificationData = {
          to: doc.data().token,
          notification: {
            title: 'You recueived a new message!',
            body: message,
          },
        };
        FirebaseHelper.sendNotification(notificationData);
        emptyFields();
        Toast.show({
          type: 'success',
          text1: 'Updated!',
          text2: 'Message has beent sent successfully!',
        });
      });
    })

  
  }

  const sendMessage = () => {
    if (vehicleReg == user?.vehicle_number) {
      emptyFields();
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'You can not send message to yourself!',
      });
      return;
    }

    if (vehicleReg == '') {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Vehicle registration number is required!',
      });
      return;
    }
    if (message == '') {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Message is required!',
      });
      return;
    }

    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'error!',
        text2: 'Terms and conditions must be accepted!',
      });
      return
    }
   
    setLoading(true);
    console.log('check ' + checked);
    const usersColRefSentMessages = firestore().collection(
      FirebaseSchema.chats,
    );
    const usersColRefRecieved = firestore()
      .collection(FirebaseSchema.user)
      .doc(user?.uid)
      .collection(FirebaseSchema.sentMessages);
    const data = {
      uid: user?.uid,
      vehicle_number: user?.vehicle_number,
      message: message,
      isReplyAllow: checked,
      isRecieved: false,
      username: user?.username,
      datetime: new Date().toISOString(),
    };
    usersColRefRecieved
      .add(data)
      .then(docRef => {
        const sentId = docRef.id;
        docRef.update({chat_id: sentId});
        // if the user has already sent a message, then update the isRecieved field to true
        firestore().collection(FirebaseSchema.user)
        .where('vehicle_number', '==', vehicleReg)
        .onSnapshot(querySnapshot => {
          if (!querySnapshot.empty) {
             docRef.update({isRecieved: true});
          }
        });
        usersColRefSentMessages
          .doc(vehicleReg)
          .collection(FirebaseSchema.active_chats)
          .add(data)
          .then(docRef => {
            const id = docRef.id;
            docRef.update({chat_id: id});
            firestore().collection(FirebaseSchema.user)
            .where('vehicle_number', '==', vehicleReg)
            .onSnapshot(querySnapshot => {
              if (!querySnapshot.empty) {
                 docRef.update({isRecieved: true});
              }
            });
             if (image!=null) {
              uploadImageToFirebase(image, id, sentId);
             } else{
                sendNotification();
             }
          })
          .catch(err => {
            setLoading(false);
            console.log('Error: ' + err);
          });
      })
      .catch(err => {
        setLoading(false);
        console.log('Error: ' + err);
      });
  };

  const generateUniqueFilename = () => {
    console.log('generateUniqueFilename running');
    const timestamp = new Date().getTime();
    return `image_${timestamp}.jpg`;
  };
  const getDownloadURL = async imageName => {
    console.log('getDownloadURL running');
    const reference = storage().ref(`images/${imageName}`);
    try {
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      setLoading(false);
      console.error('Error getting download URL: ', error);
      return null;
    }
  };
  const uploadImageToFirebase = async (uri, id, id2) => {
    console.log('uploadImageToFirebase running');
    const imageName = generateUniqueFilename();
    const reference = storage().ref(`images/${imageName}`);
    //console.log('Reference: ', reference);
    // console.log('imageName: ', imageName);
    try {
      await reference.putFile(uri);
      console.log('Image uploaded successfully!');
      const downloadURL = await getDownloadURL(imageName);
      console.log('Download URL:', downloadURL);
      const pf_data = {img_url: downloadURL, img_path: imageName};
      firestore()
        .collection(FirebaseSchema.user)
        .doc(user?.uid)
        .collection(FirebaseSchema.sentMessages)
        .doc(id2)
        .update(pf_data);
      const dB = firestore()
        .collection(FirebaseSchema.chats)
        .doc(vehicleReg)
        .collection(FirebaseSchema.active_chats)
        .doc(id);
      dB.update(pf_data)
        .then(() => {
         sendNotification();           
        })
        .catch(error => {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error!',
            text2: 'Failed to upload image!',
          });
          console.log('Error ' + JSON.stringify(error));
        });
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image: ', error);
    }
  };

  return (
    <>
      <AppLoading isVisible={isLoading} />
      <SafeAreaView style={styles.screen}>
        <TouchableOpacity style={{margin: 10}}>
          <Icon
            onPress={() => navigation.openDrawer()}
            type={'entypo'}
            name={'menu'}
            color={Colors.WHITE}
            size={30}
          />
        </TouchableOpacity>

        <ScrollView>
          <View
            style={{
              width: '96%',
              alignItems: 'center',
              marginTop: hp(22),
              alignSelf: 'center',
            }}>
            <Text style={styles.title}>{AppStrings.SEND_MESSAGE_TEXT}</Text>
          </View>

          <AppInput
            inputContainer={[styles.input, {marginTop: hp(6)}]}
            isIcon={true}
            iconName={'car'}
            iconType={'font-awesome'}
            placeholder={'Vehicle Registeration'}
            value={vehicleReg}
            onChange={text => setVehicleReg(text.replace(/[a-z]/g, ''))}
            cap="characters"
            editAble={isEditable}
          />
          <AppInput
            inputContainer={styles.input}
            isIcon={true}
            iconName={'filetext1'}
            iconType={'ant-design'}
            placeholder={'Message'}
            value={message}
            onChange={text => setMessage(text)}
            isError={vError}
            errorText={vTextError}
            cap={'none'}
          />

          <View
            style={{
              width: '90%',
              height: 40,
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: Colors.INPUT_BG,
              borderRadius: 5,
              paddingLeft: 20,
              marginVertical: 5,
            }}>
            <Icon
              name="upload"
              type="feather"
              Colors={Colors.TEXT_COLOR}
              style={{alignSelf: 'center'}}
            />
            <TouchableOpacity
              onPress={() => {
                updatePicture();
              }}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  height: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginStart: 20,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontSize: 14,
                  }}>
                  {fileType}
                </Text>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                paddingStart: 10,
              }}>
              {fileText}
            </Text>
          </View>

          <View style={{marginVertical: 5}}>
            <AppDropdown
              defaultValue={country}
              onChange={text => setCountry(text)}
            />
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: Colors.BLACK,
              marginTop: hp(1),
            }}>
            {AppStrings.REPLY_TEXT}
          </Text>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <RadioButton
              value={checked}
              status={checked === true ? 'checked' : 'unchecked'}
              onPress={() => setChecked(true)}
            />
            <Text>{'Yes'}</Text>
            <RadioButton
              value={checked}
              status={checked === false ? 'checked' : 'unchecked'}
              onPress={() => setChecked(false)}
            />
            <Text>{'No'}</Text>
          </View>

          <View
            style={{
              marginTop: 5,
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
                  navigation.navigate(Routes.TERMS_CONDITIONS);
                }
              }}
              isChecked={isChecked}
              checkBoxColor={Colors.WHITE}
              checkedCheckBoxColor={Colors.GREEN}
            />
            <Text onPress={() =>  {
              navigation.navigate(Routes.TERMS_CONDITIONS);
              setChecked(true);
            }} style={{fontSize: 14, alignSelf: 'center', color: 'blue'}}>
              Terms and Conditions agreement
            </Text>
          </View>

          <AppButton
            title={'Send!'}
            onPress={() => {
              sendMessage();
            }}
            containerStyle={styles.btnContainer}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  btnContainer: {
    marginVertical: 5,
    alignSelf: 'center',
  },
  input: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
  },
});
