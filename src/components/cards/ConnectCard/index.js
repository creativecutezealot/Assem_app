import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, ImageBackground } from 'react-native';

import styles from './styles';
import { getDisplayName } from '../../../helpers/utils';
import NavigationService from '../../../routers/navigation';
import APIConfig from '../../../api/const';

const ENDPOINTS = APIConfig.apiEndpoints;

const ConnectCard = (props) => {
	const { onPress, item, disabled, showVoiceBtn, onSendVoiceNote } = props;
	const source = item.photo_url ? { uri: item.photo_url } : require('../../../assets/images/register/user.png');

	const presenceUser = useSelector(state => state.presenceUser && state.presenceUser[item.user_id] ? state.presenceUser[item.user_id] : null);
	const isActive = React.useMemo(() => {
		if (presenceUser) {
			if (presenceUser.presence === 'active') {
				return true;
			}
			return false;
		} else if (item.presence === 'active') {
			return true;
		}
		return false;
	}, [presenceUser, item]);


	return (
		<TouchableOpacity
			onPress={() => {
				NavigationService.navigate('MemberInfoModal', { user: item });
			}}
			style={styles.container}>
			<ImageBackground source={source} style={styles.photo} imageStyle={{ borderRadius: 8 }}>
				{item.is_manager && (
					<View style={styles.managerBanner}>
						<Text style={{ color: 'white', }}>Manager</Text>
					</View>
				)}
				<View style={[styles.presence, {
					backgroundColor: isActive ? '#00ff00' : 'transparent'
				}]}></View>
			</ImageBackground>
			<View style={styles.nameWrapper}>
				<Text style={[styles.name]}>{getDisplayName(`${item.first_name}${item.last_name}`)}</Text>
			</View>
			<View style={styles.labelWrapper}>
				<Text numberOfLines={2} ellipsizeMode='tail' style={[styles.role]}>{item.job}  {item.company}</Text>
			</View>
			<View style={styles.cellbtnWrapper}>
				<TouchableOpacity style={[styles.btn, disabled ? styles.disabledBtn : null]} onPress={onPress}>
					<Text style={styles.btnTxt}>{disabled ? 'Following' : 'Follow'}</Text>
				</TouchableOpacity>
				{showVoiceBtn && (
					<TouchableOpacity style={[styles.btn, { marginTop: 6 }]} onPress={onSendVoiceNote}>
						<Text style={styles.btnTxt}>Message</Text>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity >
	);
};

ConnectCard.propTypes = {
	item: PropTypes.object,
	showVoiceBtn: PropTypes.bool,
	onPress: PropTypes.func,
	onSendVoiceNote: PropTypes.func,
};

ConnectCard.defaultProps = {
	item: null,
	showVoiceBtn: false,
	onPress: () => { },
	onSendVoiceNote: () => { },
};

export default ConnectCard;