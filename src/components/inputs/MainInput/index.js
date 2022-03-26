import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';

import styles from './styles';

class MainInput extends React.PureComponent {
	render() {
		const {
			onFocus, value, styleWrapper, placeholder
		} = this.props;
		return (    
			<View style={[styles.container, styleWrapper]}>       
				<TextInput  
					onFocus={onFocus}
					value={value}    
					placeholder={placeholder}      
					style={ styles.textInputStyle}
				/>        
			</View>
     
		);
	}
}

MainInput.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.string,
	onFocus: PropTypes.func,
	styleWrapper: PropTypes.any,
};

MainInput.defaultProps = {
	placeholder: null,
	value: null,
	onFocus: () => {}, 
	styleWrapper: {},
};

export default MainInput;