import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../Constants/Colors';
import {hp, wp} from '../../Constants/constant';
import Icon from '../../Constants/Icons';
import ViewMoreModal from '../ViewMoreModal';
import ConfirmationDialog from '../ConfirmationDialog';
import Routes from '../../utils/Routes';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import AppLoading from '../AppLoading';
import firestore from '@react-native-firebase/firestore';
import { FirebaseSchema } from '../../Database/FirebaseSchema';
import storage from '@react-native-firebase/storage';




const InboxItem = ({data,inbox}) => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isLoading,setLoading] = useState(false);
  //console.log('datetime ' + data?.isReplyAllow);
  const replyAllow = data?.isReplyAllow;
  const formattedDateTime = moment(data?.datetime).format('hh:mm A MM/DD/YYYY');

  const deleteMessage = async() => {
    setDialogVisible(false);
   console.log('chat id '+data.chat_id)
   console.log('image path '+data.img_url)
   const reference =  storage().refFromURL(data?.img_url);
   await reference.delete();
    if (inbox) {
    await firestore()
      .collection(FirebaseSchema.chats)
      .doc(data?.vehicle_number)
      .collection(FirebaseSchema.active_chats)
      .doc(data?.chat_id)
      .delete();
    } else{
      await firestore()
      .collection(FirebaseSchema.chats)
      .doc(data?.vehicle_number)
      .collection(FirebaseSchema.active_chats)
      .doc(data?.chat_id)
      .delete();
      await firestore()
      .collection(FirebaseSchema.user)
      .doc(data?.uid)
      .collection(FirebaseSchema.sentMessages)
      .doc(data?.chat_id)
      .delete();
    }
  };

  return (
    <>
      <ViewMoreModal
        visible={isVisible}
        onClose={() => {
          setVisible(false);
        }}
        item={data}
        inbox={inbox}
      />
      <ConfirmationDialog
        content={'Are you sure you want to delete this message?'}
        isVisible={isDialogVisible}
        onPress1={() => {
          setDialogVisible(false);
        }}
        onPress2={deleteMessage}
      />
      <SafeAreaView style={styles.screen}>
        <Image style={styles.avatar} source={{uri: data?.img_url}} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.username}>{inbox === true?`Username: ${data?.username}`:`Vehicle Number: ${data?.vehicle_number}`}</Text>
          <View>
            <Text style={styles.label}>{formattedDateTime}</Text>
            <Text
              onPress={() => {
                setVisible(true);
              }}
              style={[styles.label, {color: 'blue'}]}>
              {`View more`}
            </Text>
          </View>
        </View>
        <View style={{justifyContent: 'center', padding: 10}}>
          {replyAllow ? (
            <TouchableOpacity>
              <Icon
                style={{marginVertical: 2}}
                name="reply"
                type="Entypo"
                size={25}
                Colors ={Colors.TEXT_COLOR}

                onPress={() => {
                  navigation.navigate(Routes.HOME_SCREEN);
                }}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity>
            <Icon
              style={{marginVertical: 2}}
              name="delete"
              type="material-community"
              size={25}
              Colors ={Colors.TEXT_COLOR}
              onPress={() => {
                setDialogVisible(true);
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default InboxItem;

const styles = StyleSheet.create({
  screen: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: wp(20),
    height: hp(10),
    borderRadius: 80,
    margin: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginStart: 20,
    textAlign: 'left',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginStart: 20,
  },
});
