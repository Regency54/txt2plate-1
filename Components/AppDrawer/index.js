import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '../../Constants/Colors';
import Icon from '../../Constants/Icons';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../utils/Routes';
import ConfirmationDialog from '../ConfirmationDialog';
import auth from '@react-native-firebase/auth';
import StorageService from '../../utils/StorageService';
import {FirebaseSchema} from '../../Database/FirebaseSchema';

const AppDrawer = () => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = useState(false);
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
      console.error('Error', error);

     }
  }, []);

  return (
    <>
      {isVisible?(<ConfirmationDialog
        isVisible={isVisible}
        onPress1={() => {
          setVisible(false);
        }}
        onPress2={() => {
          setVisible(false);
          auth()
            .signOut()
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{name: Routes.SIGN_IN}],
              });
            });
        }}
      />):null}
      <View style={styles.screen}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={
              user?.img_url
                ? {uri: user?.img_url}
                : require('../../src/Images/pf.jpg')
            }
          />
          <Text style={styles.headerTitle}>{user?.username}</Text>
          <Text style={styles.headerContent}>{'Vegicle Registeration'}</Text>
          <Text
            style={[styles.headerContent, {marginBottom: 5, color: 'yellow'}]}>
            {user?.vehicle_number}
          </Text>
        </View>

        <View style={styles.drawer}>
          <DrawerContentScrollView>
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="entypo"
                  name="user"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Profile"
              onPress={() => {
                navigation.navigate(Routes.PROFILE);
              }}
              labelStyle={styles.labelStyle}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="entypo"
                  name="message"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Inbox"
              onPress={() => {
                navigation.navigate(Routes.INBOX);
              }}
              labelStyle={styles.labelStyle}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="feather"
                  name="send"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Sent Messages"
              onPress={() => {
                navigation.navigate(Routes.SENT);
              }}
              labelStyle={styles.labelStyle}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="foundation"
                  name="clipboard-notes"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Terms and Conditions"
              onPress={() => {}}
              labelStyle={styles.labelStyle}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="feather"
                  name="settings"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Settings"
              onPress={() => {}}
              labelStyle={styles.labelStyle}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="feather"
                  name="help-circle"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Get Help"
              onPress={() => {}}
              labelStyle={styles.labelStyle}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="materialIcons"
                  name="feedback"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Send Feedback"
              onPress={() => {}}
              labelStyle={styles.labelStyle}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  type="materialIcons"
                  name="logout"
                  size={25}
                  Colors={Colors.TEXT_COLOR}
                />
              )}
              label="Logout"
              onPress={() => {
                setVisible(true);
              }}
              labelStyle={styles.labelStyle}
            />
          </DrawerContentScrollView>
        </View>
      </View>
    </>
  );
};

export default AppDrawer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: '30%',
    backgroundColor: Colors.BLACK,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 30,
    borderRadius: 50,
  },
  labelStyle: {
    color: Colors.TEXT_COLOR,
    fontSize: 16,
  },
  drawer: {
    width: '100%',
    height: '80%',
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.WHITE,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    color: Colors.WHITE,
    marginTop: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
