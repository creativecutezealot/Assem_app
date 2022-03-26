import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import NavigationService from '../../routers/navigation';
const avatar = ({ user, size = 50, disabled = false }) => {
    const { id, photo_url } = user;
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => {
                NavigationService.navigate('MemberInfoModal', { user });
            }}
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                borderRadius: size * 0.13,
                borderColor: 'white',
                borderWidth: 2,
            }}
        >
            {photo_url && photo_url != '' ? (
                <Image
                    source={{ uri: photo_url }}
                    style={{
                        width: size - 2,
                        height: size - 2,
                        borderRadius: size * 0.13,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <FontAwesome5Pro
                    name={'user'}
                    solid
                    color={'white'}
                    style={{ fontSize: size * 0.7 }}
                />
            )}
        </TouchableOpacity>
    );
};

export default avatar;
