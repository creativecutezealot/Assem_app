import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../../styles/const';
const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: constants.colors.border,
		margin: 4,
		borderRadius: 10,
		padding: 12,
		maxWidth: width / 2 - 24
	},
	titleWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	},
	nameWrapper: {
		width: '100%',
		alignItems: 'center',
		marginTop: 10,
	},
	labelWrapper: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: 40,
		marginTop: 8,
	},
	imageWrapper: {
		flex: 1,
		alignItems: 'center',
	},
	cellbtnWrapper: {
		marginTop: 12,
		alignItems: 'center',
		width: '100%',
	},
	clubWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginVertical: 8,
		width: width - 50,
	},
	photo: {
		width: 80,
		height: 80,
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderRadius: 6,
	},
	name: {
		color: 'white',
		fontSize: 14,
		fontFamily: constants.fonts.proximaNovaRegular,
		textAlign: 'center',
	},
	role: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaRegular,
		fontWeight: '500',
		fontSize: 14,
		textAlign: 'center',
	},
	clubname: {
		color: constants.colors.primary,
		marginRight: 10,
	},
	btn: {
		backgroundColor: constants.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 24,
		borderRadius: 6,
		width: '85%'
	},
	btnTxt: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaRegular,
		fontWeight: '500'
	},
	disabledBtn: {
		backgroundColor: 'gray'
	},
	managerBanner: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: constants.colors.gray_dark,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	presence: {
		top: - 3,
		right: -3,
		width: 10,
		height: 10,
		borderRadius: 5,
		position: 'absolute',
	}
});
