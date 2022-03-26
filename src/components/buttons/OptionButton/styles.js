import { StyleSheet } from 'react-native';

import constants from '../../../styles/const';

export default StyleSheet.create({
	buttonWrapper: {    
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	label: {
		color: constants.colors.white,
		fontFamily: constants.fonts.sweetSans,
		fontSize: 14,
	},
	labelWrapper: {
		marginLeft: 10,
		justifyContent: 'center',
        
	},
	optionWrapper: {
		width: 25,
		height: 25,
		borderRadius: 7,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	checked: {
		width: 16,
		height: 16,
		borderRadius: 5,
		backgroundColor: constants.colors.primary
	}
});
