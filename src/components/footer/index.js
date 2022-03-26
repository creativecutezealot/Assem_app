import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

function FooterContent(props) {
    const {
        sortType,
        iconName,
        description,
        iconType = 0,
        onPress = () => {},
    } = props;
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(sortType)}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <FontAwesome5Pro
                        name={iconName}
                        style={styles.icon}
                        light={iconType == 0}
                        solid={iconType == 1}
                    />
                </View>
                <Text style={styles.textDes}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopColor: '#B3B3B3',
        borderTopWidth: 5,
        padding: 16,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 24,
        color: 'white',
    },
    textDes: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
        color: 'white',
        marginLeft: 16,
    },
});

export default FooterContent;
