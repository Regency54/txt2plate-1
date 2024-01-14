import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';
import AppButton from '../AppButton';


const AppAlert = ({isVisible,onPress,title,content}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.screen}>
        <Text style={styles.title}>
            {title}
        </Text>
        <Text style={styles.desc}>
            {content}
        </Text>
        <AppButton
        title={'OK'}
        onPress={onPress}
        />
      </View>
    </Modal>
  )
}

export default AppAlert;

const styles = StyleSheet.create({
    screen:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.WHITE,
        borderRadius:20
    },
    title:{
        fontSize:18,
        color:Colors.BLACK,
        fontWeight:'bold',
        alignSelf:'center',
        marginVertical:10
    },
    desc:{
        fontSize:16,
        width:'90%',
        color:Colors.TEXT_COLOR,
        fontWeight:'bold',
        alignSelf:'center',
        textAlign:'center'
    },
    btnContainer:{
        marginVertical:12
    }
})