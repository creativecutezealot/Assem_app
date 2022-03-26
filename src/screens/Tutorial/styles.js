import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
    },
    backgroundView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: constants.colors.primary_blue,
    },
    guideWrapper: {
        alignSelf: 'center',
        marginTop: height * 0.02,
        width: width,
        height: logoHeight * 1.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
    },
    logoWrapper: {
        alignSelf: 'center',
        marginTop: 10,
        borderLeftColor: constants.colors.background,
        borderLeftWidth: 4,
        width: width,
        height: logoHeight * 1.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: logoHeight,
        width: logoWidth,
    },

    btnWrapper: {
        marginBottom: 70,
        marginTop: 30,
        width: width * 0.48,
        alignSelf: 'center',
        height: 36,
        backgroundColor: constants.colors.background,
    },

    signBtn: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.primary,
        paddingLeft: 5,
        fontSize: 14,
    },

    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'black',
        width: '90%',
        marginTop: 40,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    iconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconMic: {
        width: 30,
        height: 43,
    },
    iconPlus: {
        width: 42,
        height: 42,
    },
    iconHand: {
        width: 33,
        height: 40,
    },
    textWrapper: {
        flexDirection: 'row',

        width: '90%',
        marginTop: 15,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide4: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide5: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        marginTop: 5,
        color: '#fff',
        fontSize: 20,
        fontFamily: constants.fonts.proximaNovaRegular,
    },
    textState: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontFamily: constants.fonts.sweetSans,
    },
    textPlay: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 16,
        fontSize: 18,
        fontFamily: constants.fonts.sweetSans,
    },
    topWrapper: {
        paddingHorizontal: 10,
        width: width,
        height: logoHeight,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: 40,
        height: logoHeight + 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avRoutePicker: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
    },
});
