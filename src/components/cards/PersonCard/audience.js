import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import styles from './styles';
import constants from '../../../styles/const';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';

const img_person = require('../../../assets/images/home/active_person.png');
const img_hand = require('../../../assets/images/home/hand.png');
const img_hangin = require('../../../assets/images/home/hangin.png');
const img_hangout = require('../../../assets/images/home/hangout.png');
class AudienceCard extends React.PureComponent {
	render() {
		const {
			onPress, item, isLiked,
		} = this.props;
		const backgroundColor = constants.colors.dark;
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={[styles.audienceContainer, { backgroundColor }]}>
					<Image source={item.photo_url ? { uri: item.photo_url } : img_person} style={styles.audienceImage} resizeMode={'stretch'} />
					{isLiked && (
						<View style={styles.overlap}>
							<FontAwesome5 name="thumbs-up" style={{
								fontSize: 40,
								color: 'white'
							}} light />
						</View>
					)}
					<View style={styles.audiencebuttonWrapper}>
						<View style={[styles.audienceButton]}>
						</View>
						{item.handup && (
							<View style={[styles.audienceButton, { backgroundColor: constants.colors.primary_blue }]}>
								<FontAwesome5 name="arrow-alt-up" style={styles.audienceIcon} solid={item.handup} />
							</View>
						)}
					</View>
					<View style={styles.footWrapper}>
						<Text style={[styles.name, { fontSize: 13, textAlign: 'center' }]}>{item.first_name || 'No Name'} {item.last_name ? `${item.last_name.slice(0, 1)}.` : ''}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

AudienceCard.propTypes = {
	item: PropTypes.object,
	onPress: PropTypes.func,
};

AudienceCard.defaultProps = {
	item: null
};

export default AudienceCard;