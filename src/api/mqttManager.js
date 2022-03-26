import MQTT from 'sp-react-native-mqtt';
import store from '../store';
import { parseJSONorNot } from '../helpers/utils';
import {
	MQTT_HOST,
	MQTT_USERNAME,
	MQTT_PASSWORD,
	MQTT_PORT,
} from '../helpers/config';

import {
	mqttClosed,
	mqttConnected,
	mqttDisconnected,
	mqttError,
	mqttMessageReceived,
} from '../actions/socket';
import { requestSuccess as updateViewerRequest } from '../actions/viewer/updateViewer';
import { update as inviteAssemble } from '../actions/assemble/inviteAssemble';
import { update as inviteAudio } from '../actions/audio/inviteAudio';
import { update as inviteVoicenote } from '../actions/voicenote/inviteVoicenote';
import { update as inviteEvent } from '../actions/event/inviteEvent';
import { update as likeUser } from '../actions/user/likeUser';
import { update as presenceUser } from '../actions/user/presenceUser';
import {
	addList,
	updateList,
	deleteList,
} from '../actions/club/getListByClubId';
import { requestSuccess as endAssemble } from '../actions/assemble/deleteAssemble';
import { requestSuccess as endEvent } from '../actions/event/deleteEvent';
import { request as getListByClubIdRequest } from '../actions/club/getListByClubId';
module.exports = {
	props: null,
	randIdCreator() {
		// eslint-disable-next-line
		const S4 = () =>
			(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
	},
	create() {
		this.onConnectionOpened = this.onConnectionOpened.bind(this);
		this.onConnectionClosed = this.onConnectionClosed.bind(this);
		this.onError = this.onError.bind(this);
		this.onMessageArrived = this.onMessageArrived.bind(this);
		this.disconnect = this.disconnect.bind(this);

		const deviceId = this.randIdCreator().replace(/[^a-zA-Z0-9]+/g, '');

		/* create mqtt client */
		return MQTT.createClient({
			uri: `mqtt://${MQTT_HOST}:${MQTT_PORT}`,
			host: MQTT_HOST,
			keepalive: 10,
			port: MQTT_PORT,
			clientId: deviceId,
			user: MQTT_USERNAME,
			pass: MQTT_PASSWORD,
			auth: true,
		})
			.then(client => {
				this.client = client;
				client.on('closed', this.onConnectionClosed);
				client.on('error', this.onError);
				client.on('message', this.onMessageArrived);
				client.on('connect', this.onConnectionOpened);
				client.connect();
				return client;
			})
			.catch(err => {
				console.log(`@@@@@ MQTT.createtClient error: ${err}`);
				return null;
			});
	},

	disconnect() {
		if (this.client) {
			console.log('@@@@@ Now killing open realtime connection.');
			this.client.disconnect();
			store.dispatch(mqttDisconnected());
		}
	},

	onError(error) {
		console.log(`@@@@@ MQTT onError: ${error}`);
		store.dispatch(mqttError(error));
	},

	onConnectionOpened() {
		console.log('@@@@@ MQTT onConnectionOpened');
		store.dispatch(mqttConnected());
	},

	onConnectionClosed(err) {
		console.log(`@@@@@ MQTT onConnectionClosed ${err}`);
		store.dispatch(mqttClosed(err));
	},

	onMessageArrived(message) {
		if (message) {
			const topic = message.topic.replace(
				`presence/${MQTT_USERNAME}/`,
				''
			);
			console.log('@@@@@ onMessageArrived', topic);
			if (topic.includes('viewer')) {
				const socketData = message.data;
				const user_id = global.currentUser.user_id;
				if (
					socketData &&
					typeof parseJSONorNot(socketData) === 'object'
				) {
					const socket_viewer = parseJSONorNot(socketData);
					if (user_id && socket_viewer.viewer_id === user_id) {
						if (topic.includes('update')) {
							const payload = { id: user_id };
							const updateData = {
								status: true,
								data: socket_viewer,
							};
							store.dispatch(
								updateViewerRequest(updateData, payload)
							);
						}
					} else {
						store.dispatch(mqttMessageReceived(socketData, topic));
					}
				}
			} else if (topic.includes('invite')) {
				const inviteData = parseJSONorNot(message.data);
				console.log('@@@@@ add list ==> 1', inviteData);
				if (inviteData && typeof inviteData === 'object') {
					const { message, data } = inviteData;
					store.dispatch(addList(data, { id: data.enter_club_id }));
					if (topic.includes('assembly')) {
						store.dispatch(inviteAssemble(inviteData));
					} else if (topic.includes('audio')) {
						store.dispatch(inviteAudio(inviteData));
					} else if (topic.includes('voicenote')) {
						store.dispatch(inviteVoicenote(inviteData));
					} else if (topic.includes('event')) {
						store.dispatch(inviteEvent(inviteData));
					}
				}
			} else if (topic.includes('update')) {
				const updateData = parseJSONorNot(message.data);
				console.log('@@@@@ update list ==> 1');
				if (updateData && typeof updateData === 'object') {
					const { message, data } = updateData;
					store.dispatch(
						updateList(data, { id: data.enter_club_id })
					);
				}
			} else if (topic.includes('delete')) {
				const delData = parseJSONorNot(message.data);
				console.log('@@@@@ delete list ==> 1', delData);
				if (delData && typeof delData === 'object') {
					const { message, data } = delData;
					store.dispatch(
						deleteList(data, { id: data.enter_club_id })
					);
				}
			} else if (topic.includes('end')) {
				const endData = parseJSONorNot(message.data);
				console.log('@@@@@@ end list ==> 1', endData);
				if (endData && typeof endData === 'object') {
					const { message, data } = endData;
					if (topic.includes('assembly')) {
						store.dispatch(endAssemble(data, { id: data.assemble_id }));
					} else if (topic.includes('event')) {
						console.log('@@@@@@ end list ==> 2', data);
						store.dispatch(endEvent(data, { id: data.event_id }));
					}
				}
			} else if (topic.includes('like')) {
				const likeData = parseJSONorNot(message.data);
				if (likeData && typeof likeData === 'object') {
					if (topic.includes('user')) {
						console.log('@@@@@ like user data');
						store.dispatch(likeUser(likeData));
					}
				}
			} else if (topic.includes('reorder')) {
				const reorderData = parseJSONorNot(message.data);
				if (reorderData.club_id && reorderData.club_id != '') {
					store.dispatch(
						getListByClubIdRequest({ id: reorderData.club_id })
					);
				}
			} else if (topic.includes('presence')) {
				const presenceData = parseJSONorNot(message.data);
				if (presenceData && typeof presenceData === 'object') {
					store.dispatch(presenceUser(presenceData));
				}
			}
		}
	},
};
