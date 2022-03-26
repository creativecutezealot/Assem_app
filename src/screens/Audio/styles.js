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

    audioContainer: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
    },

    audio: {
        width: width,
        height: 300,
    },
    imageContainer: {
        width: width,
        height: 220,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#B3B3B3',
        borderBottomWidth: 5,
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
        paddingHorizontal: '15%',
        paddingTop: 20,
        width: width,
        height: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: constants.colors.background,
    },
    footerAllAudioWrapper: {
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
    headerAllAudioContainer: {
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

    allAudioContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '85%',
    },
    backAudioContainer: {
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
    backAudioIcon: {
        fontSize: 16,
        color: constants.colors.white,
    },
    backAudioTitle: {
        fontSize: 12,
        color: constants.colors.white,
        fontWeight: '600',
        marginLeft: 6,
    },
    indexingContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 16,
        paddingBottom: 16,
    },
    indexingItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    indexingTime: {
        minWidth: 100,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: constants.colors.primary_blue,
        alignItems: 'center',
    },
    indexingTimeTxt: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    indexingDes: {
        flex: 1,
        color: 'white',
        marginLeft: 16,
        fontSize: 16,
    },
    playIcon: {
        color: 'white',
        fontSize: 54,
    },
    seekIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    seekIcon: {
        color: 'white',
        fontSize: 30,
    },
    seekText: {
        position: 'absolute',
        fontSize: 12,
        paddingTop: 3,
        color: 'white',
    },
});
