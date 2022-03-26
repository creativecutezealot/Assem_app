import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, Image } from 'react-native';

import styles from './styles';
import APIConfig from '../../../api/const';
import { getDisplayName } from '../../../helpers/utils';

import NavigationService from '../../../routers/navigation';

const ENDPOINTS = APIConfig.apiEndpoints;

const ConnectCard = (props) => {
	const {
		onPress, item, disabled
	} = props;
	return (
		<View style={{ flex: 1, }}>
			<View style={styles.container}>
				<View style={styles.titleWrapper}>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={() => {
							NavigationService.navigate('MemberInfoModal', { user: item });
						}} >
							{
								item.photo_url ?
									<Image source={{ uri: item.photo_url }} style={styles.photo} />
									:
									<Image source={require('../../../assets/images/register/user.png')} style={styles.photo} />
							}
						</TouchableOpacity>
						<View style={styles.labelWrapper}>
							<Text onPress={() => {
								NavigationService.navigate('MemberInfoModal', { user: item });
							}} style={styles.name}>{getDisplayName(`${item.first_name}${item.last_name}`)}</Text>
							<Text style={[styles.role, { textTransform: 'uppercase', paddingRight: 10 }]}>{item.job}  {item.company}</Text>
						</View>
					</View>
					<View style={styles.cellbtnWrapper}>
						<TouchableOpacity style={[styles.btn, disabled ? styles.disabledBtn : null]} onPress={onPress}>
							<Text style={styles.btnTxt}>{disabled ? 'INVITED' : 'INVITE'}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View >
		</View>
	);
};

ConnectCard.propTypes = {
	item: PropTypes.object,
	onPress: PropTypes.func,
};

ConnectCard.defaultProps = {
	item: null,
	onPress: () => { },
};

export default ConnectCard;