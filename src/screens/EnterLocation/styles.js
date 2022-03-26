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
        marginTop: height * 0.12,
        alignItems: 'center',
    },
    guide: {
        fontSize: 20,
        fontFamily: constants.fonts.sweetSans,
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

    placeHolderContainer: {
        flex: 1,
        width: logoWidth * 1.2,
        maxHeight: 80,
        marginTop: 20,
        borderTopColor: 'white',
        borderBottomColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },

    textInputWrapper: {
        height: 60,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderColor: 'green',
        borderWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },

    textInput: {
        paddingVertical: 0,
        textAlignVertical: 'top',
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        textAlign: 'center',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
    },
    description: {
        fontFamily: constants.fonts.sweetSans,
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
        fontFamily: constants.fonts.proximaNovaRegular,
        color: constants.colors.white,
        fontSize: 12,
    },
});
