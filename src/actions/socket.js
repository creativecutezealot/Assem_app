export const MQTT_CONNECTION_CLOSED = 'MQTT_CONNECTION_CLOSED';
export const MQTT_CONNECTION_ERROR = 'MQTT_CONNECTION_ERROR';
export const MQTT_CONNECTION_CONNECTED = 'MQTT_CONNECTION_CONNECTED';
export const MQTT_CONNECTION_DISCONNECTED = 'MQTT_CONNECTION_DISCONNECTED';
export const MQTT_MESSAGE_RECEIVED = 'MQTT_MESSAGE_RECEIVED';

export function mqttClosed(error) {
	return { type: MQTT_CONNECTION_CLOSED, error };
}

export function mqttError(error) {
	return { type: MQTT_CONNECTION_ERROR, error };
}

export function mqttConnected() {
	return { type: MQTT_CONNECTION_CONNECTED };
}

export function mqttDisconnected() {
	return { type: MQTT_CONNECTION_DISCONNECTED };
}

export function mqttMessageReceived(payload, topic) {
	return { type: MQTT_MESSAGE_RECEIVED, payload, topic };
}
