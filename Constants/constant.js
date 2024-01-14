import {Dimensions} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const LARGE_FONT_SIZE = 'large';
export const MEDIUM_FONT_SIZE = 'medium';
export const SMALL_FONT_SIZE = 'small';
