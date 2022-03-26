import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';
import { getDisplayName } from '../../../helpers/utils';
import NavigationService from '../../../routers/navigation';

const { width, height } = Dimensions.get('window');
import Avatar from '../../avatar';

function voiceHeader({ voice }) {
	return (
		<View style={[styles.headerWrapper, { paddingHorizontal: 16 }]}>
			<Avatar user={voice.user} />
			<View style={styles.labelWrapper}>
				<Text
					numberOfLines={1}
					ellipsizeMode="tail"
					style={[styles.headerName, { width: width * 0.8 }]}>
					{
						voice.audio_obj && voice.audio_obj.audio_name !== '' ? `${voice.audio_obj.audio_name}` : 'Message'
					}
				</Text>
				{voice.user && (
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={[styles.name, { width: width * 0.6 }]}
						onPress={() => {
							NavigationService.navigate('MemberInfoModal', { user: voice.user });
						}}
					>
                        From: {getDisplayName(`${voice.user.first_name}${voice.user.last_name}`)}
					</Text>
				)}
			</View>
		</View>
	);
}

export default voiceHeader;