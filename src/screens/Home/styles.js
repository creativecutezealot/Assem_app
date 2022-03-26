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
    },

    assemble: {
        width: width,
        height: 300,
    },

    logoWrapper: {
        padding: 10,
        borderLeftColor: constants.colors.primary,
        borderLeftWidth: 5,
        width: width,
        height: logoHeight + 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },

    settings: {
        height: 30,
        width: 30,
        marginEnd: 4,
    },

    allRoomContainer: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'transparent',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allRoomControlContainer: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginHorizontal: '1%',
        borderWidth: 1,
        borderColor: constants.colors.primary_blue,
        backgroundColor: constants.colors.background,
        width: '98%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
