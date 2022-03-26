import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

function NewMessage(props) {
    const {
        sortType,
        iconName,
        description,
        iconType = 2,
        onPress = () => {},
    } = props;
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress(sortType)}
            >
                <View style={styles.iconContainer}>
                    <FontAwesome5Pro
                        name={iconName}
                        style={styles.icon}
                        light={iconType == 0}
                        solid={iconType == 1}
                    />
                </View>
            </TouchableOpacity>
            <View style={styles.desContainer}>
                <Text style={styles.textDes}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
        color: 'white',
    },
    desContainer: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    textDes: {
        fontSize: 14,
        lineHeight: 22,
        color: 'white',
        textAlign: 'center',
    },
});

export default NewMessage;
