import { StyleSheet } from 'react-native';

import constants from '../../../styles/const';

export default StyleSheet.create({
	buttonWrapper: {
		backgroundColor: constants.colors.primary,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6
	},
	label: {
		color: constants.colors.white,
		fontFamily: constants.fonts.proximaNovaRegular,
		fontSize: 14,
	},
});
