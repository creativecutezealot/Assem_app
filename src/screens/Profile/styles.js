import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';
const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.055;
const logoWidth = logoHeight * 5.46;
const btnWidth = width * 0.5;
export default StyleSheet.create({
    topContainer: {
        backgroundColor: 'rgba(31,27,42,0.2)',
        width: '100%',
        height: 100,
        position: 'absolute',
        zIndex: -1000,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(31,27,42,0.2)',
    },
    backgroundView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(31,27,42,0.2)',
    },
    menucontainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingVertical: 25,
        paddingHorizontal: 30,
        position: 'relative',
    },
    menutopcontainer: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
    },
    btnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        width: btnWidth,
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: constants.colors.primary,
    },
    logoutBtnWrapper: {
      position: 'absolute',
      bottom: 80,
      left: 30,
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
        fontFamily: constants.fonts.proximaNovaRegular,
        fontSize: 18,
    },

    button: {
        color: 'white',
        fontSize: 14,
        fontFamily: constants.fonts.proximaNovaRegular,
        paddingVertical: 0,
        marginLeft: 10,
    },

    role: {
        color: 'white',
        fontSize: 18,
        fontFamily: constants.fonts.proximaNovaRegular,
        paddingTop: 5,
    },

    description: {
        color: '#B3B3B3',
        fontSize: 12,
        fontFamily: constants.fonts.proximaNovaRegular,
        marginTop: 16,
    },

    membersContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    memberScore: {
        height: 60,
        marginTop: 44,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    photoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    detailContainer: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
});
