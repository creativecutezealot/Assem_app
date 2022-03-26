import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';

import styles from './styles';
import constants from '../../../styles/const';

class MainButton extends React.PureComponent {
	render() {
		const {
			onPress, label, color, bgColor, styleWrapper,
		} = this.props;
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={[styles.buttonWrapper, { backgroundColor: bgColor }, styleWrapper]}>
       
					<Text style={[styles.label, { color }]}>{label}</Text>
        
				</View>
			</TouchableOpacity>
		);
	}
}

MainButton.propTypes = {
	label: PropTypes.string,
	onPress: PropTypes.func,
	color: PropTypes.string,
	bgColor: PropTypes.string,
	styleWrapper: PropTypes.any,
};

MainButton.defaultProps = {
	label: null,
	onPress: () => {},
	color: 'white',
	bgColor: constants.colors.primary,
	styleWrapper: {},
};

export default MainButton;