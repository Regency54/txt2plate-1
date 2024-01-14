import React from 'react'
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';

const AppLoading = ({isVisible}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.screen}>
      <ActivityIndicator color={Colors.PRIMARY} size={50} />
      </View>
    </Modal>
  )
}

export default AppLoading

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})