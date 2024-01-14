import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from '../../Constants/Icons';
import Colors from '../../Constants/Colors';
import {COUNTRY_CODES} from '../../Constants/Appdata';

const AppDropdown = ({onChange, defaultValue}) => {
  const data = COUNTRY_CODES.map((country, index) => ({
    label: country.en,
    value: country.en,
  }));

  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.screen}>
      {/* {renderLabel()} */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'United Kingdom' : '...'}
        searchPlaceholder="Search..."
        value={defaultValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <Icon style={styles.icon} name="flag" size={20} type="font-awesome" />
        )}
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  screen: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    margin: 5,
    marginHorizontal: 20,
    backgroundColor: Colors.INPUT_BG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    width: '100%',
    height: 40,
    paddingHorizontal: 8,
  },
  icon: {
    marginStart: 10,
    color: Colors.TEXT_COLOR,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 30,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    alignSelf: 'center',
    marginStart: 20,
    color: Colors.TEXT_COLOR,
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingStart: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
