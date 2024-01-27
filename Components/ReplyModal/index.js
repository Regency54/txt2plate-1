import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';
import Icon from '../../Constants/Icons';
import AppButton from '../AppButton';
import firestore from '@react-native-firebase/firestore';
import {FirebaseSchema} from '../../Database/FirebaseSchema';
import AppAlert from '../AppAlert';
import StorageService from '../../utils/StorageService';

const ReplyModal = ({visible, onClose, vehicle}) => {
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);
  const [alertType, setType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
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
  }, []);

  const reply = () => {
    if (message == '') {
      setAlert(true);
      setType('Error');
      setAlertMessage('Please write a message first');
      setTimeout(() => {
        setAlert(false);
        setType('');
        setMessage('');
      }, 1500);
      return;
    }
    if (vehicle == '') {
      setAlert(true);
      setType('Error');
      setAlertMessage('Please select a vehicle first');
      setTimeout(() => {
        setAlert(false);
        setType('');
        setMessage('');
      }, 1500);
      return;
    }
    setLoading(true);
    const usersColRefSentMessages = firestore().collection(
      FirebaseSchema.chats,
    );
    const usersColRefRecieved = firestore()
      .collection(FirebaseSchema.user)
      .doc(user?.uid)
      .collection(FirebaseSchema.sentMessages);
    const data = {
      uid: user?.uid,
      vehicle_number: vehicle,
      message: message,
      isReplyAllow: true,
      isRecieved: false,
      username: user?.username,
      datetime: new Date().toISOString(),
    };
    usersColRefRecieved
      .add(data)
      .then(docRef => {
        const sentId = docRef.id;
        docRef.update({chat_id: sentId});
        usersColRefSentMessages
          .doc(vehicle)
          .collection(FirebaseSchema.active_chats)
          .add(data)
          .then(docRef => {
            const id = docRef.id;
            docRef.update({chat_id: id});
            setLoading(false);
            setType('Success');
            setAlertMessage('Message sent successfully');
            setMessage('');
            onClose();
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
  return (
    <>
      <AppAlert
        isVisible={alert}
        title={alertType}
        content={alertMessage}
        isButton={false}
      />
      <Modal isVisible={visible}>
        {isLoading ? (
          <ActivityIndicator size={50} color={Colors.PRIMARY} />
        ) : (
          <View style={styles.screen}>
            <Icon
              onPress={() => {
                onClose();
                setMessage('');
              }}
              style={styles.cross}
              type="entypo"
              name="cross"
              Colors={Colors.GREY}
              size={30}
            />
            <TextInput
              style={styles.input}
              isIcon={true}
              placeholder={'Message'}
              value={message}
              onChangeText={text => setMessage(text)}
              keyboardType="default"
              multiline={true}
            />

            <AppButton
              title={'Send'}
              onPress={() => {
                setMessage('');
                reply();
              }}
              containerStyle={styles.btn}
            />
          </View>
        )}
      </Modal>
    </>
  );
};

export default ReplyModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
  },
  cross: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  input: {
    marginHorizontal: 20,
    marginTop: 50,
    textAlign: 'left',
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT_COLOR,
    fontSize: 16,
  },
  btn: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
});
