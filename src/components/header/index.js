// @flow

import React from 'react';
import { Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';

import Navigation from '../../routers/navigation';
import styles from './styles';
import Touchable from '../touchable';

function NavHeader({ title, hiddenBack, onBackPress, backType }) {
    const onBack = () => {
        Navigation.back();
    };
    const renderLeft = () => {
        return (
            <Touchable
                disabled={hiddenBack}
                onPress={onBackPress ? onBackPress : onBack}
            >
                <View style={styles.backIconContainer}>
                    {!hiddenBack && (
                        <FontAwesome5
                            name={
                                backType === 'back' ? 'chevron-left' : 'times'
                            }
                            color={'white'}
                            size={backType === 'back' ? 28 : 32}
                            light
                        />
                    )}
                </View>
            </Touchable>
        );
    };

    const renderCenter = () => {
        return (
            <View>
                <Text style={styles.title}>{title}</Text>
            </View>
        );
    };

    const renderRight = () => {
        return (
            <Touchable onPress={() => {}}>
                <View style={styles.backIconContainer} />
            </Touchable>
        );
    };

    return (
        <View style={styles.container}>
            {renderLeft()}
            {renderCenter()}
            {renderRight()}
        </View>
    );
}

export default NavHeader;
