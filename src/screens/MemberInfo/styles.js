import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.5;

export default StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'stretch',
    },

    memberContainer: {
        flex: 1,
        width: '100%',
        padding: 30,
        flexDirection: 'column',
    },

    memberScore: {
        height: 60,
        marginTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    detailContainer: {
        marginTop: 10,
        flexDirection: 'column',
    },

    photo: {
        width: 90,
        height: 90,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    btnWrapper: {
        width: 140,
        alignSelf: 'center',
        paddingVertical: 8,
        marginBottom: 10,
        borderRadius: 6,
    },

    disableBtnWrapper: {
        width: 140,
        alignSelf: 'center',
        paddingVertical: 8,
        backgroundColor: 'gray',
        marginBottom: 10,
        borderRadius: 6,
    },

    logoWrapper: {
        padding: 10,
        marginTop: 40,
        borderLeftColor: constants.colors.primary,
        borderLeftWidth: 4,
        width: width,
        height: logoHeight * 1.4,
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
        padding: 20,
        width: width,
        height: 90,
        position: 'absolute',
        bottom: 20,
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

    activeHeaderWrapper: {
        width: width,
        height: 80,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0AF',
    },

    imageWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },

    activePhoto: {
        width: 30,
        height: 35,
        marginLeft: 20,
        marginRight: 20,
        resizeMode: 'stretch',
    },

    labelWrapper: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: width * 0.4,
    },

    titleWrapper: {
        alignItems: 'flex-start',
        alignSelf: 'center',
        flexShrink: 1,
    },

    title: {
        color: 'white',
        fontFamily: constants.fonts.proximaNovaBold,
        fontSize: 18,
    },

    name: {
        color: 'white',
        fontFamily: constants.fonts.proximaNovaBold,
        fontSize: 18,
    },

    role: {
        color: 'white',
        fontSize: 16,
        fontFamily: constants.fonts.proximaNovaRegular,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    closeButton: {
        marginLeft: 8,
        marginTop: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 32,
        textAlign: 'center',
        color: '#FFF',
    },
    managerBanner: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: constants.colors.gray_dark,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    presence: {
        top: -3,
        right: -3,
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
    },
});
