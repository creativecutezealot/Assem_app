import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import styles from './styles';
import constants from '../../../styles/const';
import { getUnSingedInt } from '../../../helpers/agoraUtil';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';

const img_person = require('../../../assets/images/home/active_person.png');
const img_hand = require('../../../assets/images/home/hand.png');
const img_hangin = require('../../../assets/images/home/hangin.png');
const img_hangout = require('../../../assets/images/home/hangout.png');
class StageCard extends React.PureComponent {
	render() {
		const {
			onPress, item, viewerSpeakers, assemble, isLiked
		} = this.props;
		const speakerIdx = viewerSpeakers.findIndex(q => `${getUnSingedInt(q.uid)}` === `${item.agora_uid}`);
		const isSpeaking = speakerIdx >= 0 && viewerSpeakers[speakerIdx].volume > 70 ? true : false;
		const backgroundColor = isSpeaking ? constants.colors.primary_blue : constants.colors.dark;
		const muteColor = item.muted ? constants.colors.primary_red : 'green';
		const isHost = item.user_id === assemble.user_id;
		const hostColor = isHost ? constants.colors.primary_blue : 'transparent';
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={[styles.container, { backgroundColor }]}>
					<Image source={item.photo_url ? { uri: item.photo_url } : img_person} style={styles.stageImage} resizeMode={'stretch'} />
					{isLiked && (
						<View style={styles.overlap}>
							<FontAwesome5 name="thumbs-up" style={{
								fontSize: 40,
								color: 'white'
							}} light />
						</View>
					)}
					<View style={styles.buttonWrapper}>
						<View style={[styles.statusButton, { backgroundColor: hostColor }]}>
							{isHost && <FontAwesome5 name="star" style={styles.statusIcon} />}
						</View>
						<View style={[styles.statusButton, { backgroundColor: muteColor }]}>
							<FontAwesome5 name="volume-up" style={styles.statusIcon} />
						</View>
					</View>
					<View style={styles.footWrapper}>
						<Text style={[styles.name, { textAlign: 'center' }]}>{item.first_name || 'No Name'} {item.last_name ? `${item.last_name.slice(0, 1)}.` : ''}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

StageCard.propTypes = {
	item: PropTypes.object,
	onPress: PropTypes.func,
};

StageCard.defaultProps = {
	item: null
};

export default StageCard;