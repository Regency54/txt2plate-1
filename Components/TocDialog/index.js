import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../Constants/Colors';
import Modal from 'react-native-modal';


const TocDialog = ({isVisible}) => {
  return (
    <Modal isVisible={isVisible}>
      <Text>TocDialog</Text>
    </Modal>
  )
}

export default TocDialog;

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.PRIMARY,
        justifyContent:"center",
        alignItems:"center"
    }
})