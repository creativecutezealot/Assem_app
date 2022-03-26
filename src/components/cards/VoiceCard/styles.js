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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
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
		marginLeft: 16,
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

	like: {
		color: constants.colors.white,
		fontSize: 26,
	},

	play: {
		color: constants.colors.white,
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
		height: 240,
	},
	footWrapper: {
		flex: 1,
		paddingHorizontal: 16,
		height: 44,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	footerLeftWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
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
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
		backgroundColor: constants.colors.primary_red,
	},
	liveText: {
		fontFamily: constants.fonts.proximaNovaRegular,
		fontSize: 16,
		color: 'white'
	},
	headerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: width,
		height: 220,
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
		width,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginTop: 2,
	},

	descriptionWrapper: {
		width,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},

	textAudioTime: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 14,
		fontFamily: constants.fonts.sweetSans
	},
	textHeaderName: {
		fontSize: 16,
		fontFamily: constants.fonts.sweetSans,
		fontWeight: '600',
		letterSpacing: 1.5,
		color: 'white'
	},
	textHeaderDes: {
		fontSize: 14,
		fontFamily: constants.fonts.sweetSans,
		fontWeight: '500',
		color: 'white'
	},

	responseBtn: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: constants.colors.primary_blue,
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginHorizontal: 10,
	}
});
