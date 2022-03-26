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
        paddingHorizontal: 16,
        paddingBottom: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    detailContainer: {
        marginTop: 10,
        flexDirection: 'column',
    },

    photo: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    btnWrapper: {
        width: 140,
        alignSelf: 'center',
        paddingVertical: 8,
        marginBottom: 10,
    },

    disableBtnWrapper: {
        width: 140,
        alignSelf: 'center',
        paddingVertical: 8,
        backgroundColor: 'gray',
        marginBottom: 10,
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
        width: width * 0.2,
    },

    roleDes: {
        color: 'white',
        fontSize: 16,
        fontFamily: constants.fonts.proximaNovaRegular,
        lineHeight: 20,
        letterSpacing: 0.1,
    },

    roleEdit: {
        flex: 1,
        fontSize: 14,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        minHeight: 30,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
        marginLeft: 20,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
});
