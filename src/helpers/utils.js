import { Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import _debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { showMessage } from 'react-native-flash-message';

import MqttManager from '../api/mqttManager';
import { MQTT_USERNAME } from './config';
var socketClient = null;

export const getUTCToday = s => {
	let todayEpoch = new Date().getTime();
	return todayEpoch;
};

export const isFullName = fullName => {
	const pattern = /^[a-zA-Z]{2,40}/;
	return pattern.test(fullName);
};

export const isEmail = email => {
	const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
	return pattern.test(email);
};

export const isPassword = password => {
	const pattern = /^(?=.*[a-z])((?=.*[0-9])|(?=.*[!@#$%^&*]))(?=.{8,})/;
	return pattern.test(password);
};

export const getDisplayName = (text, frontSign = '@') => {
	if (text && text != '') {
		return `${frontSign}${text.replace(/\s/g, '').trim()}`;
	}
	return '';
};

export const isAddress = address => {
	const pattern = /^[a-zA-Z0-9\s,'-]*$/;
	return pattern.test(address);
};

export const removeSpace = (text = '') => {
	return text.replace(/\s/g, '').trim();
};

export const parseJSONorNot = mayBeJSON => {
	if (typeof mayBeJSON === 'string') {
		return JSON.parse(mayBeJSON);
	} else {
		return mayBeJSON;
	}
};

// async storage utils

export const getObjInfo = async key => {
	try {
		var res = await AsyncStorage.getItem(key);
		return JSON.parse(res);
	} catch (error) {
		return null;
	}
};

export const setObjInfo = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		return false;
	}
};

export const removeObjInfo = async key => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (error) {
		return false;
	}
};

export const clearInfo = async () => {
	try {
		const allKeys = await AsyncStorage.getAllKeys();
		if (allKeys.length > 0) {
			await AsyncStorage.clear();
		}
		return true;
	} catch (error) {
		return false;
	}
};

// socket utils

export const createSocketClient = async () => {
	socketClient = await MqttManager.create();
};

export const publishTopic = (topic, data) => {
	if (socketClient) {
		const trans_topic = `presence/${MQTT_USERNAME}/${topic}`;
		socketClient.publish(trans_topic.toLocaleLowerCase(), data, 1, true);
	}
};

export const subscribeTopic = topic => {
	if (socketClient) {
		const rec_radar_topic = `presence/${MQTT_USERNAME}/${topic}`;
		socketClient.subscribe(rec_radar_topic.toLocaleLowerCase(), 1);
	}
};

export const preventDoubleTap = fn => {
	return _debounce(fn, 500, { leading: true, trailing: false });
};

export const isIphoneX = () => {
	const deviceHeight = Dimensions.get('window').height;
	const deviceWidth = Dimensions.get('window').width;
	var isIphoneX =
		Platform.OS === 'ios' && deviceHeight >= 812 && deviceWidth >= 375;
	return isIphoneX;
};

export const checkRecordPermission = () => {
	if (Platform.OS === 'android') {
		requestMultiple([
			PERMISSIONS.ANDROID.RECORD_AUDIO,
			PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
		]).then(statuses => {
			console.log('@@@@@ Audio', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
			console.log('@@@@@ WRITE_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
		});
	}
};

export const checkPermissions = () => {
	if (Platform.OS == 'ios') {
		requestMultiple([
			PERMISSIONS.IOS.CAMERA,
			PERMISSIONS.IOS.PHOTO_LIBRARY,
			PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
			PERMISSIONS.IOS.LOCATION_ALWAYS,
		]).then(statuses => { });
	} else if (Platform.OS === 'android') {
		requestMultiple([
			PERMISSIONS.ANDROID.CAMERA,
			PERMISSIONS.ANDROID.RECORD_AUDIO,
			PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
			PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
			PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
		]).then(statuses => { });
	}
	requestUserPermission();
};

export const requestUserPermission = async () => {
	const authStatus = await messaging().requestPermission({
		sound: true,
		badge: true,
		alert: true,
		announcement: true,
	});
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log('@@@@@ Authorization status:', authStatus);
	}
	return enabled;
};

export const checkURL = url => {
	if (url) {
		const str = url.toLowerCase();
		return str.match(/\.(jpeg|jpg|gif|png|heic)$/) != null;
	}
	return false;
};

export const sortByUpdatedAt = (a, b) => {
	const aUp_At = new Date(a.updated_at).getTime();
	const bUp_At = new Date(b.updated_at).getTime();
	if (aUp_At > bUp_At) {
		return 1;
	} else if (aUp_At < bUp_At) {
		return -1;
	} else {
		return 0;
	}
};

const pad = num => {
	return ('0' + num).slice(-2);
};
export const mmssss = milisecs => {
	var secs = Math.floor(milisecs / 1000);
	var minutes = Math.floor(secs / 60);
	var seconds = secs % 60;
	var miliseconds = Math.floor((milisecs % 1000) / 10);
	return pad(minutes) + ':' + pad(seconds); //+ ':' + pad(miliseconds);
};

export const getCurrentLocalTime = time => {
	const currentTimeZone = moment.tz.guess();
	const currentLocalTime = moment.tz(time, currentTimeZone);
	const currentConvertedTime = currentLocalTime
		.clone()
		.tz('America/Los_Angeles')
		.utc()
		.format();
	return currentConvertedTime;
};

export const assembleIsLive = item => {
	const startTime = moment.tz(item.start_time, 'America/Los_Angeles');
	const currrentTime = moment().tz('America/Los_Angeles');
	const user_includs =
		item.is_allow_all ||
		(item.selected_users &&
			item.selected_users.includes(global.currentUser.user_id));
	if (!user_includs) {
		return false;
	}
	const isStarted = typeof item.is_immediately === 'string' ? item.is_immediately === 'true' : item.is_immediately || startTime.unix() < currrentTime.unix();

	return isStarted;
};

export const showFlashMsg = (message, error = true) => {
	showMessage({
		message,
		backgroundColor: error ? '#F34D2E' : '#198917',
	});
};

export const converTimeToSecond = time => {
	const splitTimeStr = time.split(':');
	const hour = splitTimeStr[0];
	const minintes = splitTimeStr[1];
	const seconds = splitTimeStr[2];
	const timeMilisec =
		Number(hour) * 3600 + Number(minintes) * 60 + Number(seconds);
	return timeMilisec;
};
