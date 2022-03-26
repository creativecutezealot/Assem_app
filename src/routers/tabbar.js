import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';
import constants from '../styles/const';

function MyTabBar(props) {
	const { focused, title, onPress, iconName, iconActive = false } = props;
	const color = iconActive ? constants.colors.primary : 'white';
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<FontAwesome5
				name={iconName}
				color={iconActive ? constants.colors.primary : 'white'}
				size={28}
				light={!focused}
				solid={focused}
			/>
			<Text
				style={{
					fontFamily: constants.fonts.sweetSans,
					fontWeight: '600',
					fontSize: 11,
					letterSpacing: 0.05,
					textAlign: 'center',
					color: color,
					marginTop: 8,
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
}
export default MyTabBar;
