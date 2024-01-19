import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constants/Colors';
import Icon from '../../Constants/Icons';

export default function AppInput({
  value,
  onBtnPress,
  placeholder,
  onChange,
  isPass,
  isIcon,
  isDropdown,
  iconName,
  iconType,
  options,
  inputContainer = {},
  type,
  placeholderColor,
  isText,
  textBtn,
  editAble,
  textBtnColor,
  isError = false,
  errorText = 'Error text',
  cap,
  ...props
}) {
  const [visible, setVisible] = useState(isPass ? false : true);
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <>

        {isIcon ? (
          <TouchableOpacity>
            <Icon name={iconName} type={iconType} Colors={Colors.TEXT_COLOR} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={
            placeholderColor ? placeholderColor : Colors.TEXT_COLOR
          }
          value={value}
          onChangeText={val => onChange(val)}
          selectionColor={Colors.WHITE}
          secureTextEntry={!visible}
          {...props}
          style={[styles.input, props?.style ? props.style : {}]}
          cursorColor={Colors.TEXT_COLOR}
          keyboardType={type}
          editable={editAble}
          autoCapitalize={cap}
        />
      </>
      {isError ? (
        <Text
          style={{
            color: 'red',
            fontSize: 12,
            fontWeight: 'bold',
          }}>
          {errorText}
        </Text>
      ) : null}
       {isPass ? (
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              color={Colors.TEXT_COLOR}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}

      {isText ? (
        <TouchableOpacity onPress={onBtnPress}>
          <Text
            style={{
              color: textBtnColor ? textBtnColor : Colors.PRIMARY,
              fontSize: 14,
              fontFamily: fonts.latoRegular,
              fontWeight: 'bold',
            }}>
            {textBtn}
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.INPUT_BG,
    height: 40,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 10,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: -1,
  },
  input: {
    color: Colors.TEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginStart: 15,
  },
});
