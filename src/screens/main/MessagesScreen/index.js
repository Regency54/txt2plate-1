import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import Colors from '../../../../Constants/Colors';
import InboxItem from '../../../../Components/InboxItem';
import {hp} from '../../../../Constants/constant';
import firestore from '@react-native-firebase/firestore';
import {FirebaseSchema} from '../../../../Database/FirebaseSchema';
import AppLoading from '../../../../Components/AppLoading';
import StorageService from '../../../../utils/StorageService';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = () => {
  const navigation = useNavigation();


  const renderItem = itemData => {
    return <InboxItem data={itemData.item} inbox={true} getList={getMessages} isInbox={true}/>;
  };
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [user,setUser] = useState(null);
  useEffect(()=>{
    StorageService.getItem(FirebaseSchema.user)
    .then((retrievedObject) => {
      if (retrievedObject) {
        setUser(retrievedObject);
        console.log('Retrieved object:', retrievedObject);
      } else {
        console.log('Object not found in AsyncStorage');
      }
    })
    .catch((error) => {
      console.error('Error retrieving object:', error);
    });
  },[])

  useEffect(() => {
    navigation.setParams({ id: null });
  }, []);

  useEffect(() => {
     getMessages()
  }, [user?.vehicle_number]);

  const getMessages = ()=>{
    setLoading(true); 
    setMessages([]);
    console.log("vehicle "+user?.vehicle_number)
     firestore()
     .collection(FirebaseSchema.chats)
     .doc(user?.vehicle_number)
     .collection(FirebaseSchema.active_chats)
     .onSnapshot(querySnapshot => {
       if (querySnapshot.empty) {
         console.log('No messages found');
         setLoading(false);
         return;
       }
       const updatedMessages = [];
       // Iterate through the documents in the snapshot
       querySnapshot.forEach(doc => {
         // Extract the data from each document
         const messageData = doc.data();
         updatedMessages.push(messageData);
       });

       // Update the state with the latest messages
       console.log('Updated messages:', updatedMessages);
       setMessages(updatedMessages);
       setLoading(false);
     });
  }
  

  return (
    <>
      <AppLoading isVisible={isLoading} />
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Inbox</Text>
        <FlatList
          style={{marginVertical: 10}}
          data={messages}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginTop: hp(2),
    alignSelf: 'center',
  },
});
