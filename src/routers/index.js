import React from 'react';
import {
	StatusBar,
	Platform,
	Dimensions,
} from 'react-native';
import {
	createAppContainer,
	createSwitchNavigator,
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import NavigationService from './navigation';
import setupSentry from '../helpers/sentry';
import FlashMessage from 'react-native-flash-message';

import Splash from '../screens/Splash';

import constants from '../styles/const';
import Login from '../screens/Login';
import LoginInput from '../screens/LoginInput';
import EnterCode from '../screens/EnterCode';
import EnterPhone from '../screens/EnterPhone';
import EnterEmail from '../screens/EnterEmail';
import EnterName from '../screens/EnterName';
import EnterPassword from '../screens/EnterPassword';
import EnterBirth from '../screens/EnterBirth';
import EnterProfessional from '../screens/EnterProfessional';
import EnterLocation from '../screens/EnterLocation';
import EnterPhoto from '../screens/EnterPhoto';
import EnterClubInfo from '../screens/EnterClubInfo';
import Home from '../screens/Home';
import CodeRequest from '../screens/CodeRequest';
import ConfirmPhoneCode from '../screens/ConfirmPhoneCode';
import ForgotPass from '../screens/ForgotPass';
import ResetPass from '../screens/ResetPass';
import ConfirmPassCode from '../screens/ConfirmPassCode';
import CompleteResetPass from '../screens/ForgotPass/complete';
import Tutorial from '../screens/Tutorial';

import CreateAssembly from '../screens/CreateAssembly';
import CreateVoiceVote from '../screens/CreateVoiceVote';
import MyClub from '../screens/MyClub';
import Assembly from '../screens/Assembly';
import MemberInfo from '../screens/MemberInfo';
import EditMemberInfo from '../screens/EditMemberInfo';
import ClubMembers from '../screens/ClubMembers';
import JoinClub from '../screens/JoinClub';
import Profile from '../screens/Profile';
import Follow from '../screens/Follow';
import AudioPlayer from '../screens/Audio';

import MyTabBar from './tabbar';

import MainContextProvider from '../context';

import R from 'ramda';
import ChannelScreen from '../screens/ChannelScreen';
import ChannelListScreen from '../screens/ChannelListScreen';
import UserSelectorScreen from '../screens/UserSelectorScreen';
import DeleteChannelListScreen from '../screens/DeleteChannel';

const AuthStack = createStackNavigator(
	{
		Login,
		LoginInput,
		EnterCode,
		EnterPhone,
		EnterEmail,
		EnterName,
		EnterPassword,
		EnterBirth,
		EnterProfessional,
		EnterLocation,
		EnterPhoto,
		Home,
		CodeRequest,
		ConfirmPhoneCode,
		ConfirmPassCode,
		ForgotPass,
		ResetPass,
		CompleteResetPass,
		Tutorial,
	},
	{
		headerMode: 'none',
	}
);

const AuthMainStack = createStackNavigator(
	{
		Main: {
			screen: AuthStack,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		ClubInfoModal: {
			screen: EnterClubInfo,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
	},
	{
		mode: 'modal',
		// transitionConfig: nav => handleTransition(nav),
		cardStyle: {
			backgroundColor: constants.colors.black_.medium,
			opacity: 1,
		},
	}
);

const MainNavigator = createStackNavigator(
	{
		Home,
		Tutorial,
	},
	{
		headerMode: 'none',
	}
);

const MainRootStack = createStackNavigator(
	{
		Home: {
			screen: MainNavigator,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		Assembly: {
			screen: Assembly,
			navigationOptions: {
				headerShown: false,
				gestureEnabled: false,
			},
		},
		AudioPlayer: {
			screen: AudioPlayer,
			navigationOptions: {
				headerShown: false,
				gestureEnabled: false,
			},
		},
	},
	{
		mode: 'modal',
		// transitionConfig: nav => handleTransition(nav),
		cardStyle: {
			backgroundColor: constants.colors.black_.medium,
			opacity: 1,
		},
	}
);

const RootStack = createDrawerNavigator(
	{
		Home: {
			screen: MainRootStack,
			navigationOptions: {
				drawerLockMode: 'unlocked',
			},
		},
	},
	{
		contentComponent: navigationObj => {
			return <Profile navigation={navigationObj.navigation} />;
		},
		drawerLockMode: 'unlocked',
		drawerPosition: 'left',
		drawerWidth: () => {
			return Dimensions.get('window').width * 0.7;
		},
		drawerType: 'front',
		drawerBackgroundColor: 'rgba(0,0,0,0.7)',
		backBehavior: 'none',
		gestureEnabled: true,
	},
	{
		navigationOptions: {
			drawerLockMode: 'unlocked',
		},
	}
);

const HomeMainStack = createStackNavigator(
	{
		Main: {
			screen: RootStack,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		Assembly: {
			screen: Assembly,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
				gestureEnabled: false,
			}),
		},
		StartAssemlbyModal: {
			screen: CreateAssembly,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		VoiceNoteModal: {
			screen: CreateVoiceVote,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		MyClubsModal: {
			screen: MyClub,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		JoinClubModal: {
			screen: JoinClub,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		MemberInfoModal: {
			screen: MemberInfo,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		EditMemberModal: {
			screen: EditMemberInfo,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		ClubMembersModal: {
			screen: ClubMembers,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		FollowModal: {
			screen: Follow,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		EnterClubInfoModal: {
			screen: EnterClubInfo,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		ChannelScreen: {
			screen: ChannelScreen,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		ChannelListScreen: {
			screen: ChannelListScreen,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		UserSelectorScreen: {
			screen: UserSelectorScreen,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
		DeleteChannelListScreen: {
			screen: DeleteChannelListScreen,
			navigationOptions: ({ navigation }) => ({
				headerShown: false,
			}),
		},
	},
	{
		mode: 'modal',
		// transitionConfig: nav => handleTransition(nav),
		cardStyle: {
			backgroundColor: constants.colors.black_.medium,
			opacity: 1,
		},
	}
);

const MainStack = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: Splash,
			Start: HomeMainStack,
			Auth: AuthMainStack,
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);

class Routers extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		setupSentry();
	}

	render() {
		return (
			<MainContextProvider>
				<React.Fragment>
					{Platform.OS === 'ios' && (
						<StatusBar barStyle="light-content" />
					)}
					<MainStack
						ref={navigateRef => {
							NavigationService.setTopLevelNavigator(navigateRef);
						}}
					/>
					<FlashMessage
						position="top"
						titleStyle={{ textAlign: 'center', fontSize: 14 }}
					/>
				</React.Fragment>
			</MainContextProvider>
		);
	}
}
export default Routers;
