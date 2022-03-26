import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';
const { width, height } = Dimensions.get('window');

function audioHeader({ audio }) {
	const showStr = `Posted By: @${audio.host_name}`;
	return (
		<View style={styles.headerWrapper}>
			<View style={styles.labelWrapper}>
				<Text
					numberOfLines={2}
					ellipsizeMode="tail"
					style={[styles.headerName]}>
					{audio.audio_name}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
					<View style={{ width: width * 0.8 }}>
						<Text
							style={styles.name}>
							{showStr}{'   '}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

export default audioHeader;