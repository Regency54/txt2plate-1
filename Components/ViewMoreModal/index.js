import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';
import AppButton from '../AppButton';

const ViewMoreModal = ({visible, onClose,item,inbox}) => {
  const sendEmail = () => {
    const subject = '';
    const recipients = ['Admin@txt2plate.co.uk'];
    const body = '';

    const mailtoUrl = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl)
      .then(() => console.log('Opened email app'))
      .catch((error) => console.error('Error opening email app:', error));
  };
  return (
    <Modal isVisible={visible}>
      <View style={styles.screen}>
      {item.img_url ? (
  <Image style={styles.img} source={{ uri: item.img_url }} />
) : (
  <Image style={styles.img} source={require('../../src/Images/logo.jpg')} />
)}
        <View style={{height: '40%', padding: 5}}>
          <ScrollView>
            <Text style={styles.lable}>{item?.message}</Text>
          </ScrollView>
        </View>

        <View
          style={[
            styles.bottomContainer,
            {justifyContent: inbox ? 'space-between' : 'center'},
          ]}>
          {inbox ? (
            <AppButton
              title={'Report'}
              containerStyle={styles.btn}
              onPress={sendEmail}
            />
          ) : null}
          <AppButton
            title={'Ok'}
            containerStyle={styles.btn}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ViewMoreModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
  },
  img: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  bottomContainer: {
    flexDirection:'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal:40,
  },
  btn: {
    alignSelf: 'center',
  },
  lable: {
    textAlign: 'justify',
    padding:5
  },
});
