import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../../Constants/Colors';
import Modal from 'react-native-modal';
import AppButton from '../AppButton';

const ConfirmationDialog = ({isVisible,onPress1, onPress2,content ="Are you sure you want to logout?"}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.text}>{content}</Text>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            marginVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppButton containerStyle={styles.btnContainer} title={'Cancel'} onPress={onPress1} />
          <AppButton containerStyle={styles.btnContainer} title={'Yes'} onPress={onPress2} />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationDialog;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: '50%',
    padding:10
  },
  text: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight:'bold',
    alignSelf:'center',
    marginVertical:5
  },
  btnContainer: {
    marginVertical: 5,
  },
});
