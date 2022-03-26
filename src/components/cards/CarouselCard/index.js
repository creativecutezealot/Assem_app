import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, ImageBackground } from 'react-native';

import styles from './styles';
const img_user = require('../../../assets/images/register/user.png');
const img_banner = require('../../../assets/images/register/background-club.jpg');

class CarouselCard extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			onPress,
			item,
			isAssemble = false,
			joined = false,
			isLogin = false,
		} = this.props;
		const title = 'CLUB INFO';
		const backgroundSource = item.photo_url ? { uri: item.photo_url } : img_banner;
		return (
			<TouchableOpacity onPress={() => {
				onPress(item);
			}}>
				<ImageBackground source={backgroundSource} style={styles.container} >
					<TouchableOpacity
						style={styles.btn}
						onPress={() => {
							onPress(item);
						}}>
						<Text style={styles.btnTxt}>{title}</Text>
					</TouchableOpacity>
					{joined && (
						<View style={styles.memberBadge}>
							<Text style={styles.memberText}>YOU ARE A MEMBER</Text>
						</View>
					)}
				</ImageBackground>
			</TouchableOpacity>
		);
	}
}

CarouselCard.propTypes = {
	item: PropTypes.object,
	onPress: PropTypes.func,
};

CarouselCard.defaultProps = {
	item: null,
};

export default CarouselCard;