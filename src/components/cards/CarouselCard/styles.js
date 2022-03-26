import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../../styles/const';
const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
	container: {
		marginLeft: 5,
		marginRight: 5,
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	memberBadge: {
		width: '100%',
		paddingVertical: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: constants.colors.gray_dark,
		marginLeft: 5,
		marginRight: 5,
	},
	memberText: {
		fontSize: 14,
		color: constants.colors.white,
		fontFamily: constants.fonts.proximaNovaRegular
	},
	clubNameTxt: {
		position: 'absolute',
		top: 10,
		left: 10,
		fontSize: 18,
		color: constants.colors.white,
		fontFamily: constants.fonts.proximaNovaRegular
	},
	photo: {
		position: 'absolute',
		top: 5,
		bottom: 5,
		left: 5,
		right: 5,
		width: width * 0.7 - 10,
		height: height * 0.45 - 10,
	},
	nameTxt: {
		color: 'black',
		fontFamily: constants.fonts.proximaNovaBold,
		fontSize: 20,
		marginTop: 30
	},
	countTxt: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaBold,
	},
	btn: {
		backgroundColor: constants.colors.primary,
		width: width * 0.45,
		height: 36,
		marginBottom: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6
	},
	btn_private: {
		backgroundColor: constants.colors.primary,
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn_private_my: {
		backgroundColor: constants.colors.primary_red,
		paddingHorizontal: 24,
		paddingVertical: 10,
		marginBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnTxt: {
		fontSize: 14,
		color: constants.colors.white,
		fontFamily: constants.fonts.proximaNovaRegular
	},
	disableBtn: {
		backgroundColor: 'gray',
	},
	textInputWrapper: {
		width: width * 0.6,
		textAlign: 'center',
		alignSelf: 'center',
		paddingHorizontal: 15,
		height: 40,
		borderColor: 'white',
		borderWidth: 1,
		fontFamily: constants.fonts.proximaNovaRegular,
		color: 'black',
		backgroundColor: constants.colors.white,
		marginBottom: 20,
	},

	headerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},

	headerTitleWrapper: {
		alignItems: 'center',
		justifyContent: 'center'
	},

	playerWrapper: {
		width,
		position: 'absolute',
		bottom: 0
	},

	playTextWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginTop: 16
	},

	textAudioTime: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 14,
		fontFamily: constants.fonts.sweetSans
	},
	textHeaderName: {
		fontSize: 20,
		fontFamily: constants.fonts.proximaNovaRegular,
		letterSpacing: 1.5,
		color: constants.colors.white,
		fontWeight: '400'
	},
	textHeaderDes: {
		fontSize: 20,
		fontFamily: constants.fonts.proximaNovaRegular,
		color: constants.colors.primary_blue,
		fontWeight: '600'
	},

});
