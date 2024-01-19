import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '../../Constants/Colors'
import Icon from '../../Constants/Icons';
import { DrawerItem,DrawerContentScrollView } from '@react-navigation/drawer';

const AppDrawer = () => {
  const [image, setImage] = useState(null);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          style={styles.pf}
          source={image ? {uri: image} : require('../../src/Images/pf.jpg')}
        />
      </View>
      <Text style={{color: Colors.WHITE, marginTop: 10}}>
          {'John Doe'}
        </Text>

        <View style={styles.drawer}>
          <DrawerContentScrollView>
          <DrawerItem
            // icon={({color, size}) => (
            //   <Icon name="home" size={25} color={Colors.TEXT_COLOR} />
            // )}
            label="My Inventory"
            onPress={() => {
              
            }}
            labelStyle={styles.labelStyle}
          />

          </DrawerContentScrollView>

        </View>
    </View>
  );
};

export default AppDrawer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: '25%',
    backgroundColor: Colors.BLACK,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 50,
  },
  labelStyle: {
    color: Colors.BACKGROUNDCOLOR,
    fontSize: 16,
  },
  drawer:{
    width:'100%',
    height:'80%'
  }
});
