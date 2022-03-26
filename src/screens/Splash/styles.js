import { StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

export default StyleSheet.create({
    logoWrapper: {
        alignSelf: 'center',
        width: width * 0.6,
    },
});
