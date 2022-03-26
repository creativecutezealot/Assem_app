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
    wrapper: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        marginTop: '10%',
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
    },
    guideDes: {
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 24,
        fontSize: 14,
        lineHeight: 14 * 1.1,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: 'white',
    },
    btnWrapper: {
        marginTop: 10,
        width: width * 0.6,
        alignSelf: 'center',
        height: 36,
    },
    comment: {
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
        fontSize: 12,
    },
    commentBtn: {
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.primary,
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    carouselWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        height: height * 0.45,
    },
    cardWrapper: {
        borderRadius: 40,
        height: height * 0.45,
        marginLeft: 5,
        marginRight: 5,
    },
    textInputWrapper: {
        width: width * 0.6,
        textAlign: 'center',
        alignSelf: 'center',
        paddingHorizontal: 15,
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: 'black',
        backgroundColor: constants.colors.white,
    },
});
