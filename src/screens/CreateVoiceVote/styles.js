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
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guide: {
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
    },

    itemContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 24,
    },
    guideDes: {
        alignItems: 'center',
        textAlign: 'left',
        width: '100%',
        fontSize: 16,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: 'white',
    },

    textInputWrapper: {
        marginTop: 10,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 15,
        height: 40,
        fontSize: 15,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
    },

    btnWrapper: {
        marginTop: 10,
        width: width * 0.48,
        alignSelf: 'center',
        height: 36,
    },

    textWrapper: {
        marginTop: 40,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    comment: {
        marginTop: 4,
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
        fontSize: 12,
    },
    dateTxt: {
        paddingTop: 3,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: constants.fonts.sweetSans,
        color: 'white',
        width: '100%',
    },
    tableWrapper: {
        height: height * 0.4,
    },

    ///
    absoluteFill: {
        backgroundColor: 'black',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: '100%',
    },
    ///
});
