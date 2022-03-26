import { StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;

export default StyleSheet.create({
    ///
    absoluteFill: {
        backgroundColor: 'black',
        // position: 'absolute',
        width: '100%',
        // bottom: 0,
        height: '100%',
    },
    ///
});
