import { StyleSheet } from 'react-native';

import constants from '../../styles/const';

export default StyleSheet.create({
    container: {
        height: 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backIconContainer: {
        flex: 1,
        paddingRight: 18,
        paddingLeft: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: 'white',
        fontSize: 26,
        lineHeight: 28,
    },
    backTxt: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        paddingLeft: 10,
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        textAlignVertical: 'top',
    },
    title: {
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'top',
        color: 'white',
        fontFamily: constants.fonts.sweetSans,
        fontSize: 20,
        letterSpacing: 2,
        paddingTop: 8,
    },
});
