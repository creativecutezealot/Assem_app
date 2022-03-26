import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';

import styles from './styles';

class OptionButton extends React.PureComponent {
	render() {
		const {
			onPress, label1, label2, isChecked, styleWrapper, value = ''
		} = this.props;
		return (
			<TouchableOpacity onPress={() => {
				onPress(value);
			}}>
				<View style={[styles.buttonWrapper, styleWrapper]}>
					<View style={styles.optionWrapper}>
						{isChecked && <View style={styles.checked} />}
					</View>
					{label1 && (
						<View style={styles.labelWrapper}>
							<Text style={styles.label}>{label1}</Text>
							{label2 && <Text style={styles.label}>{label2}</Text>}
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	}
}

OptionButton.propTypes = {
	label1: PropTypes.string,
	label2: PropTypes.string,
	onPress: PropTypes.func,
	isChecked: PropTypes.bool,
	styleWrapper: PropTypes.any,
};

OptionButton.defaultProps = {
	onPress: () => { },
	isChecked: false,
	styleWrapper: {},
};

export default OptionButton;