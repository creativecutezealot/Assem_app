import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        alignSelf: 'center',
        height: logoHeight,
        width: logoWidth,
    },
    btnWrapper: {
        marginTop: 50,
        width: width * 0.48,
        alignSelf: 'center',
        height: 36,
    },
    textWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    comment: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        fontSize: 14,
    },
    signBtn: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        paddingLeft: 5,
        fontSize: 14,
    },
});
