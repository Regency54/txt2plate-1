import React, { useState } from 'react';
import { StyleSheet, View,Text,TouchableOpacity } from 'react-native';
import Colors from '../../Constants/Colors';
import Modal from 'react-native-modal';
import AppInput from '../AppInput';
import AppButton from '../AppButton';
import Icon from '../../Constants/Icons';
import AppAlert from '../AppAlert';
import { AppStrings } from '../../utils/AppStrings';
import auth from '@react-native-firebase/auth';


const PasswordChangeDialog = ({ isVisible, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [isAlert,setAlert] = useState(false);
  const [alertTitle,setTitle] = useState('Error');
  const [errorText,setError] = useState('');
  const [isLoading,setLoading] = useState (false);
  const [passwordErrorText,setPErrorText] = useState('')
  const [passwordError,setPError] = useState(false)
  const [nPasswordErrorText,setNpErrorText] = useState('')
  const [nPasswordError,setNpError] = useState(false)

  

  const onUpdate = () => {
    // Validate Old Password
    if (oldPassword == '') {
      setPError(true);
      setPErrorText(AppStrings.FIELD_REQUIRED);
    } else {
      setPError(false);
      setPErrorText('');
    }
    if (password === '') {
      setNpError(true);
      setNpErrorText(AppStrings.FIELD_REQUIRED);
      return;
    } else if (password.length < 6) {
      setNpError(true);
      setNpErrorText(AppStrings.PASSWORD_ERROR);
      return;
    } else if (cPassword === '') {
      setNpError(true);
      setNpErrorText(AppStrings.FIELD_REQUIRED);
      return;
    } else if (password !== cPassword) {
      setNpError(true);
      setNpErrorText(AppStrings.PASSWORD_ERROR);

      return;
    } else {
      setNpError(false);
      setNpErrorText('');
    }
    // Final Check before Update
    if (oldPassword && password && cPassword) {
      setLoading(true);
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, oldPassword);
      user.reauthenticateWithCredential(credential)
      .then(() => {
        user.updatePassword(password)
          .then(() => {
            setLoading(false);
            setAlert(true);
            setTitle("Success")
            setError('Password updated successfully');
          })
          .catch(error => {
            setLoading(false);
            setError('Error updating password');
            setAlert(true);
            //console.error('Error updating password:', error);
          });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-credential') {
            setLoading(false);
            setError('Invalid old password');
            setAlert(true);  
        } else{
            setLoading(false);
            setError('Invalid old password');
            setAlert(true); 
        }
       
        //console.error('Error reauthenticating:', error.code);
      });
    }
  };

  return (
   <>
   {isAlert?(
   <AppAlert
   title={alertTitle}
   content={errorText}
   isVisible={isAlert}
   onPress={()=>{
    if (alertTitle == 'Success') {
        onClose();
    }
    setAlert(false);
   }}
   />):null}
    <Modal isVisible={isVisible}>
      <View style={styles.screen}>
      <TouchableOpacity>
          <Icon
            name="cross"
            type="entypo"
            style={{position: 'absolute', right: 20, top: 15}}
            size={30}
            onPress={() => {
              onClose();
            }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <AppInput
          value={oldPassword}
          placeholder={'Old password'}
          onChange={text => setOldPassword(text)}
          inputContainer={styles.input}
          isIcon={true}
          iconName={'lock'}
          iconType={'font-awesome'}
          secureTextEntry={true}
          isError={passwordError}
          errorText={passwordErrorText}

        />
        <AppInput
          value={password}
          placeholder={'New password'}
          onChange={text => setPassword(text)}
          inputContainer={styles.input}
          isIcon={true}
          iconName={'lock'}
          iconType={'font-awesome'}
          secureTextEntry={true}
          isError = {nPasswordError}
          errorText={nPasswordErrorText}
        />
        <AppInput
          value={cPassword}
          placeholder={'Confirm new password'}
          onChange={text => setCPassword(text)}
          inputContainer={styles.input}
          isIcon={true}
          iconName={'lock'}
          iconType={'font-awesome'}
          secureTextEntry={true}
          isError = {nPasswordError}
          errorText={nPasswordErrorText}
        />
        <AppButton
          title={'Update Password'}
          containerStyle={styles.btn}
          onPress={onUpdate}
          isLoading={isLoading}
        />
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius:20
  },
  title:{
   fontSize:18,
   fontWeight:"bold",
   color:Colors.BLACK,
   alignSelf:"center",
   marginVertical:15
  },
  input: {
    marginHorizontal: 20,
  },
  btn: {
    marginVertical: 20,
    alignSelf:'center',
  },
});

export default PasswordChangeDialog;
