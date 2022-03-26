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

    assembleContainer: {
        flex: 1,
        width: '100%',
        paddingTop: 16,
        alignSelf: 'center',
    },

    assemble: {
        width: width,
        height: 300,
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

    buttonsWrapper: {
        padding: 40,
        width: width,
        height: 200,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 120,
    },

    btn: {
        backgroundColor: 'red',
        width: width * 0.5,
        height: 36,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnTxt: {
        color: constants.colors.white,
        fontFamily: constants.fonts.proximaNovaRegular,
    },

    btnWrapper: {
        marginTop: 10,
        width: width * 0.5,
        alignSelf: 'center',
        height: 36,
    },

    footerWrapper: {
        paddingHorizontal: '20%',
        paddingTop: 20,
        width: width,
        height: 90,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: constants.colors.background,
    },
    footerAllRoomWrapper: {
        position: 'relative',
    },

    footerIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    footerIconRes: {
        color: constants.colors.primary_red,
        fontSize: 32,
        alignItems: 'center',
        textAlign: 'center',
        width: 40,
    },

    footerIconWhite: {
        color: constants.colors.white,
        fontSize: 32,
        alignItems: 'center',
        textAlign: 'center',
        width: 40,
    },

    footerLbl: {
        textAlign: 'center',
        color: 'white',
        fontFamily: constants.fonts.sweetSans,
        fontSize: 11,
        marginTop: 8,
    },
    headerContainer: {
        width: '100%',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: '#B3B3B3',
        borderTopWidth: 5,
        borderBottomColor: '#B3B3B3',
        borderBottomWidth: 5,
    },
    headerAllRoomContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 12,
    },
    headerTitle: {
        fontSize: 20,
        color: 'white',
        fontFamily: constants.fonts.proximaNovaBold,
        width: '85%',
    },

    sectionTitle: {
        marginVertical: 10,
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
        letterSpacing: 6,
    },

    allRoomContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '85%',
    },
    backRoomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: constants.colors.primary_blue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
        marginLeft: '35%',
    },
    backRoomIcon: {
        fontSize: 16,
        color: constants.colors.white,
    },
    backRoomTitle: {
        fontSize: 12,
        color: constants.colors.white,
        fontWeight: '600',
        marginLeft: 6,
    },
    noStageViewers: {
        marginVertical: 40,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        // fontFamily: constants.fonts.sweetSans,
        color: 'white',
        // letterSpacing: 6
    },
});
