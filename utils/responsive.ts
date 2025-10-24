/**
 * @packageDocumentation
 * Utilidades responsivas para dimensionamento relativo à tela.
 */
import { Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

/** Largura da viewport em porcentagem. */
export const vw = (pct: number) => wp(`${pct}%`);
/** Altura da viewport em porcentagem. */
export const vh = (pct: number) => hp(`${pct}%`);

/** Indica se a largura da tela é considerada pequena. */
export const isSmallDevice = () => Dimensions.get('window').width < 360;

/**
 * Ajuste simples de fonte para telas pequenas, mantendo mínimo razoável.
 */
export const fontScale = (size: number) => {
    // ajuste simples: reduz um pouco em telas muito pequenas
    if (isSmallDevice()) return Math.max(size - 2, 10);
    return size;
};
