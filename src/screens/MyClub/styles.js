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
        marginTop: '15%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: constants.fonts.proximaNovaRegular,
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
    btnWrapper: {
        // marginTop: 10,
        // width: width * 0.48,
        // alignSelf: "center",
        // height: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingLeft: 10,
        width: width * 0.48,
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: constants.colors.primary,
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        height: height * 0.45,
        position: 'relative',
    },
    paginationWrapper: {
        backgroundColor: '#191621',
    },
    cardWrapper: {
        borderRadius: 40,
        height: height * 0.45,
        marginLeft: 5,
        marginRight: 5,
    },
    button: {
        color: 'white',
        fontSize: 14,
        fontFamily: constants.fonts.proximaNovaRegular,
        paddingVertical: 0,
        // marginLeft: 10,
        textAlign: 'center',
    },
});
