import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';
import { isIphoneX } from '../../helpers/utils';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        textAlign: 'center',
    },
    absoluteFill: {
        backgroundColor: constants.colors.background,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        top: 0,
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
    },
    backgroundView: {
        ...StyleSheet.absoluteFillObject,
    },
    homecontainer: {
        flex: 1,
        resizeMode: 'stretch',
    },

    assembleContainer: {
        top: 120,
        width: width,
        position: 'absolute',
        bottom: 120,
    },

    assemble: {
        width: width,
        height: 300,
    },

    logoIcon: {
        width: 40,
        height: logoHeight + 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoTitle: {
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'top',
        color: 'white',
        fontFamily: constants.fonts.sweetSans,
        fontSize: 20,
        letterSpacing: 8,
        paddingTop: 8,
    },

    logoWrapper: {
        paddingHorizontal: 10,
        width: width,
        height: logoHeight + 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },

    logo: {
        height: logoHeight,
        width: logoWidth,
    },

    settings: {
        height: 30,
        width: 30,
        marginEnd: 4,
    },

    footerWrapper: {
        paddingHorizontal: 20,
        paddingTop: 20,
        width: width,
        position: 'absolute',
        bottom: isIphoneX() ? 34 : 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },

    footerButton: {
        marginLeft: 30,
        marginRight: 30,
        width: 40,
        height: 50,
        resizeMode: 'stretch',
    },

    plusButton: {
        width: 40,
        height: 40,
    },

    footerIconRes: {
        color: constants.colors.primary_red,
        fontSize: 36,
    },

    footerIconWhite: {
        color: constants.colors.white,
        fontSize: 36,
    },
    footerLbl: {
        textAlign: 'center',
        color: 'white',
        fontFamily: constants.fonts.sweetSans,
        fontSize: 14,
        marginTop: 8,
    },
    backIconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backTxt: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        paddingLeft: 6,
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        textAlignVertical: 'top',
    },
    mainHeaderContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    mainHeaderItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (width - 150) / 3,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: constants.colors.primary_blue,
    },
    mainHeaderTitle: {
        fontSize: 13,
        color: 'white',
        fontWeight: '500',
    },
    icon: { color: 'white', fontSize: 16, marginRight: 10 },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    subTitle: {
        color: 'white',
        fontSize: 16,
    },
    record: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151923',
    },
    channelAvatar: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
});
