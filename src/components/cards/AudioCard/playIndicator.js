import React from 'react';
import { View } from 'react-native';
import { BarIndicator } from 'react-native-indicators';

const PlayIndicator = () => {
	return (
		<View
			style={{
				backgroundColor: '#16101761',
				width: 90,
				height: 90,
				borderRadius: 20,
				alignItems: 'center',
				justifyContent: 'center'
			}}>
			<BarIndicator color="white" count={4} size={30} />
		</View>
	);
};

export default PlayIndicator;