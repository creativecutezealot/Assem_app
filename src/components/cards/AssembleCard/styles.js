import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../../styles/const';
const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
	wrapper: {
		flex: 1,
		borderTopColor: '#B3B3B3',
		borderTopWidth: 5
	},
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	swipeContainer: {
		flex: 1,
		backgroundColor: '#0000'
	},

	headerWrapper: {
		width: width,
		paddingVertical: 10,
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},

	imageWrapper: {
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},

	hostNameWrapper: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
		backgroundColor: constants.colors.gradient
	},

	photo: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
		borderRadius: 7,
		borderColor: 'white',
		borderWidth: 2
	},

	labelWrapper: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},

	titleWrapper: {
		alignItems: 'flex-end',
		alignSelf: 'center',
		marginRight: 8,
		width: width * 0.27
	},

	title: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaRegular,
		fontSize: 18,
	},

	headerName: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaBold,
		fontSize: 18,
		lineHeight: 20,
	},

	name: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaRegular,
		fontSize: 18,
		lineHeight: 20,
	},

	users: {
		color: constants.colors.primary,
		fontSize: 20,
	},

	role: {
		color: 'white',
		fontSize: 14,
		fontFamily: constants.fonts.proximaNovaRegular,
		paddingTop: 5
	},
	titleImage: {
		flex: 1,
		height: 220,
	},
	headerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: width,
		height: 220,
	},
	footWrapper: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	footerLeftWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	footerCallAction: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 44,
		paddingHorizontal: 16,
	},
	btn: {
		backgroundColor: constants.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		paddingLeft: 14,
		paddingTop: 5,
		paddingRight: 14,
		paddingBottom: 5,
	},
	btnTxt: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaRegular,
	},
	liveWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 6,
		paddingVertical: 10,
	},
	liveDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: constants.colors.primary_red,
		borderWidth: 1,
		borderColor: 'white',
	},
	liveText: {
		marginLeft: 8,
		fontFamily: constants.fonts.proximaNovaRegular,
		fontWeight: '600',
		fontSize: 16,
		color: 'white'
	},
	descriptionWrapper: {
		width,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},

});
