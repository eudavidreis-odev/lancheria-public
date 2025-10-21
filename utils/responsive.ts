import { Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const vw = (pct: number) => wp(`${pct}%`);
export const vh = (pct: number) => hp(`${pct}%`);

export const isSmallDevice = () => Dimensions.get('window').width < 360;

export const fontScale = (size: number) => {
    // ajuste simples: reduz um pouco em telas muito pequenas
    if (isSmallDevice()) return Math.max(size - 2, 10);
    return size;
};
