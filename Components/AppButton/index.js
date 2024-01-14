import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Colors from '../../Constants/Colors';

export default function AppButton({
  hasIcon = false,
  isLoading,
  title,
  containerStyle,
  onPress,
  textStyle = {},
}) {
  return (
    <TouchableOpacity
      style={[styles.btnContainer, containerStyle]}
      onPress={onPress}
      disabled={isLoading}>
      <View style={{position: 'absolute', left: 15}}>
        {hasIcon ? hasIcon : <></>}
      </View>
      {isLoading ? (
        <ActivityIndicator color={Colors.PRIMARY} />
      ) : (
        <Text style={[styles.title, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.INPUT_BG,
    borderRadius: 26,
    width:'40%',
    height: 44,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // zIndex:-1
  },
  title: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight:'bold',
    textAlign:'center',
    alignSelf:"center",
    width:'100%'
  },
});
