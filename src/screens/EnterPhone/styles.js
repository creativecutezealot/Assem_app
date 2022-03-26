import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    guideWrapper: {
        marginTop: height * 0.15,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
    },
    guideDes: {
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        fontSize: 14,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: 'white',
    },
    logo: {
        height: logoHeight,
        width: logoWidth,
    },
    inputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: logoWidth * 1.2,
        paddingHorizontal: 15,
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
    },
    textInputWrapper: {
        flex: 1,
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        textAlign: 'left',
        textAlignVertical: 'top',
        fontFamily: constants.fonts.proximaNovaRegular,
        fontSize: 18,
        color: constants.colors.white,
    },
    btnWrapper: {
        marginTop: 10,
        width: width * 0.48,
        alignSelf: 'center',
        height: 36,
    },
    textWrapper: {
        marginTop: 40,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    comment: {
        textAlign: 'center',
        width: logoWidth * 1.2,
        lineHeight: 14,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.placeholder,
        fontSize: 12,
        textTransform: 'uppercase',
    },
});
