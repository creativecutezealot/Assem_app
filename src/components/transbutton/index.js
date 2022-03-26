import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import constants from '../../styles/const';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

function TransButton(props) {
    const {
        onPress,
        iconName,
        title,
        iconType = 2,
        disabled = false,
        bgColor = '#161017',
    } = props;
    return (
        <TouchableOpacity
            style={{
                backgroundColor: `${bgColor}61`,
                width: 90,
                height: 90,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <FontAwesome5Pro
                name={iconName}
                light={iconType == 0}
                solid={iconType == 1}
                size={36}
                color={constants.colors.white}
            />
            <Text
                style={{
                    fontSize: 14,
                    fontFamily: constants.fonts.sweetSans,
                    color: constants.colors.white,
                    marginTop: 6,
                    textAlign: 'center',
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

export default TransButton;
