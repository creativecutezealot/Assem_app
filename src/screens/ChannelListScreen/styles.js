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

    searchContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: 'row',
        margin: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        includeFontPadding: false, // for android vertical text centering
        padding: 0, // removal of default text input padding on android
        paddingHorizontal: 10,
        paddingTop: 0, // removal of iOS top padding for weird centering
        textAlignVertical: 'center', // for android vertical text centering
    },
    emptyListContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    emptyListSubtitle: {
        marginTop: 8,
        textAlign: 'center',
    },
    emptyListTitle: {
        fontSize: 16,
        marginTop: 10,
    },
    emptyIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    emptyIndicatorText: { paddingTop: 28 },
    // previewContainer: {
    //     alignItems: 'center',
    //     borderBottomWidth: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     padding: 12,
    // },
    // groupContainer: {
    //     alignItems: 'center',
    //     flexDirection: 'row',
    // },
    // nameText: {
    //     fontWeight: '700',
    //     marginLeft: 8,
    // },
    channelListContainer: {
        height: '100%',
        position: 'absolute',
        width: '100%',
    },

    channelAvatar: {
        width: 40,
        height: 40,
        borderRadius: 5,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
