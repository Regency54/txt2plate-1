import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../../../Constants/Colors';
import AppButton from '../../../../Components/AppButton';
import {useNavigation} from '@react-navigation/native';
import Routes from '../../../../utils/Routes';
import ConfirmationDialog from '../../../../Components/ConfirmationDialog';
import AppLoading from '../../../../Components/AppLoading';
import auth from '@react-native-firebase/auth';


const HomeScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const svgHeight = screenHeight * 0.4;
  const [isVisible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
   <>
   <AppLoading
    isVisible={isLoading}
   />
       <ConfirmationDialog
       isVisible={isVisible}
        onPress1={() => {
          setVisible(false);
        
        }}
        onPress2={() => {
          setVisible(false);
          setLoading(true);
          auth()
          .signOut()
          .then(() => {
            setLoading(false);
            navigation.navigate(Routes.SIGN_IN);
          });
        }}
      />
    <View style={styles.screen}>
      <AppButton
        containerStyle={styles.btnContainer}
        onPress={() => {
          navigation.navigate(Routes.PROFILE);
        }}
        title={'Profile'}
      />

      <AppButton
        onPress={() => {
          setVisible(true);
        }}
        containerStyle={styles.btnContainer}
        title={'Log out'}
      />
    </View>
   </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    marginVertical: 5,
  },
});
