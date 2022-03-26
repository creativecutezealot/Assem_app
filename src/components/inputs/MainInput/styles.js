import { StyleSheet } from 'react-native';

import constants from '../../../styles/const';

export default StyleSheet.create({
	container: {
		flex: 1,
		borderColor: constants.colors.white,
		borderWidth: 2,
		height: 40,
	},
	textInputStyle: {
		borderColor: constants.colors.white,
		width: '100%',
		fontSize: 10,
		borderWidth: 1,
		borderRadius: 6,
	},
});
