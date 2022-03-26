import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: height * 0.12,
    },
    logoWrapper: {
        alignSelf: 'center',
        width: width,
        height: logoHeight * 1.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: logoHeight,
        width: logoWidth,
    },
    forgotBtnWrapper: {
        alignItems: 'center',
    },
    forgotBtn: {
        color: 'white',
        fontFamily: constants.fonts.sweetSans,
        marginTop: 7,
        fontSize: 12,
        // marginRight: width * 0.14,
    },
    textInputWrapper1: {
        marginTop: 45,
        alignSelf: 'center',
        width: logoWidth * 1.2,
        paddingHorizontal: 15,
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
    },
    textInputWrapper2: {
        marginTop: 10,
        alignSelf: 'center',
        width: logoWidth * 1.2,
        paddingHorizontal: 15,
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
    },
    btnWrapper: {
        marginTop: 20,
        width: width * 0.48,
        alignSelf: 'center',
        height: 36,
    },
    textWrapper: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    comment: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        fontSize: 14,
    },
    signBtn: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.primary,
        paddingLeft: 5,
        fontSize: 14,
    },
});