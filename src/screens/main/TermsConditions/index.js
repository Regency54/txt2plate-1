import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../../Constants/Colors'
import { hp } from '../../../../Constants/constant'
import { toc } from '../../../../Constants/Appdata'

const TermsConditions = () => {
  return (
    <SafeAreaView style={styles.screen}>
        <ScrollView>
        <Text style={styles.heading}>TermsConditions</Text>
        <Text style={styles.desc}>{toc.desc}</Text>

        </ScrollView>
    </SafeAreaView>
  )
}

export default TermsConditions

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.PRIMARY
    },
    heading:{
        fontSize:22,
        fontWeight:'bold',
        color:Colors.BLACK,
        marginTop:hp(2),
        alignSelf:'center'
    },
    desc:{
        fontSize:14,
        color:Colors.BLACK,
        marginTop:hp(2),
        alignSelf:'center',
        padding:10
    },
})