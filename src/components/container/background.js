import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

function Background({ colors }) {
    return <LinearGradient colors={colors} style={styles.backgroundView} />;
}

export default Background;
