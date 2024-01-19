import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';
import AppButton from '../AppButton';
import {toc} from '../../Constants/Appdata';

const ViewMoreModal = ({visible, onClose,item,inbox}) => {
  return (
    <Modal isVisible={visible}>
      <View style={styles.screen}>
        <Image style={styles.img} required source={{uri: item.img_url}} />

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
              onPress={onClose}
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
