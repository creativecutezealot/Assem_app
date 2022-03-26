// @flow

import React from 'react';
import { Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Navigation from '../../routers/navigation';
import styles from './styles';
import Touchable from '../touchable';

function NavHeader({ title }) {
    const onBack = () => {
        Navigation.back();
    };
    const renderLeft = () => {
        return (
            <Touchable onPress={onBack}>
                <View style={styles.backIconContainer}>
                    <FontAwesome5
                        name="chevron-left"
                        style={styles.icon}
                        light
                    />
                    <Text style={styles.backTxt}>BACK</Text>
                </View>
            </Touchable>
        );
    };

    const renderCenter = () => {
        return <View />;
    };

    const renderRight = () => {
        return <Touchable onPress={() => {}} />;
    };

    return <View style={styles.container}>{renderLeft()}</View>;
}

export default NavHeader;
