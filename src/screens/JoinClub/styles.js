import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: '10%',
    },
    guideWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        fontSize: 20,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: 'white',
        textAlign: 'center',
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
    btnWrapper: {
        marginTop: 10,
        width: width * 0.48,
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
});
