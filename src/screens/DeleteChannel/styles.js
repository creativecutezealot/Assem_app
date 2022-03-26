import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../styles/const';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    ///
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
    },
    absoluteFill: {
        backgroundColor: constants.colors.background,
        // position: 'absolute',
        width: '100%',
        // bottom: 0,
        height: '100%',
    },
    ///

    buttonLayout: {
        justifyContent: 'center',
        flexDirection: 'row',
    },

    channelContainer: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },

    listContainer: {
        height: height - 250,
    },

    title: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        paddingBottom: 10,
    },

    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        fontWeight: "400"
    },

    selectContainer: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    selectOption: {
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 50,
    },

    channelListContainer: {
        height: '100%',
        position: 'absolute',
        width: '100%',
    },

    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    icon: {
        fontSize: 16,
        color: 'white',
    },

    channelHeader: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    channelName: {
        fontSize: 16,
        color: "white",
        fontWeight: "600",
        marginLeft: 30,
    },

    button: {
        fontSize: 18,
        color: 'white',
        fontWeight: "800",
    },

    buttonContainer: {
        backgroundColor: '#E82727',
        width: 100,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
    },

    disableButtonContainer: {
        backgroundColor: 'grey',
        width: 100,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
    },
});
