import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../../styles/const';
const { width, height } = Dimensions.get('window');
const spacing = 40;
const _width = width - spacing;
export default StyleSheet.create({
	container: {
		flex: 1,
		width: _width / 3,
		paddingTop: 2,
		paddingHorizontal: 2,
		paddingBottom: 10,
		marginLeft: 10,
		flexDirection: 'column',
		borderRadius: 10,
		alignItems: 'center'
	},

	audienceContainer: {
		flex: 1,
		width: _width / 4,
		paddingTop: 2,
		paddingHorizontal: 2,
		paddingBottom: 10,
		marginLeft: 10,
		flexDirection: 'column',
		borderRadius: 8,
		alignItems: 'center'
	},


	buttonWrapper: {
		position: 'absolute',
		left: -6,
		right: -6,
		top: _width / 3 - 10 - 20,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	audiencebuttonWrapper: {
		position: 'absolute',
		left: -6,
		right: -6,
		top: _width / 4 - 10 - 20,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	statusButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 36,
		height: 36,
		borderRadius: 18,
	},

	audienceButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 30,
		height: 30,
		borderRadius: 15,
	},

	statusIcon: {
		fontSize: 20,
		color: 'white'
	},

	audienceIcon: {
		fontSize: 20,
		color: 'white'
	},

	audienceButtonWrapper: {
		position: 'absolute',
		left: -6,
		right: -6,
		top: _width / 5 - 10 - 20,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	stageImage: {
		alignSelf: 'center',
		width: _width / 3 - 4,
		height: _width / 3 - 10,
		borderRadius: 10,
	},

	stageOverlap: {
		position: 'absolute',
		top: 0,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		width: _width / 3 - 4,
		height: _width / 3 - 10,
		opacity: 0.5,
		backgroundColor: constants.colors.primary_blue
	},


	audienceImage: {
		alignSelf: 'center',
		width: _width / 4 - 4,
		height: _width / 4 - 10,
		borderRadius: 8,
	},

	overlap: {
		position: 'absolute',
		top: 0,
		bottom: 40,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.8,
		borderRadius: 10,
		backgroundColor: constants.colors.primary_blue
	},

	labelWrapper: {
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		width: width * 0.4
	},

	titleWrapper: {
		alignItems: 'flex-start',
		alignSelf: 'center',
		flexShrink: 1
	},

	title: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaBold,
		fontSize: 18,
	},

	name: {
		color: 'white',
		fontFamily: constants.fonts.proximaNovaBold,
		fontSize: 18
	},

	role: {
		color: 'white',
		fontSize: 14,
		fontFamily: constants.fonts.proximaNovaRegular,
		paddingTop: 5
	},

	footWrapper: {
		marginTop: 10,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});
