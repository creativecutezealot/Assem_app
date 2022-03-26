import * as actions from '../actions/socket';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[actions.MQTT_CONNECTION_CLOSED]: (state, action) => ({
		...state,
		connected: false,
		error: action.error,
		data: null,
		topic: null,
	}),
	[actions.MQTT_CONNECTION_ERROR]: (state, action) => ({
		...state,
		connected: false,
		error: action.error,
		data: null,
		topic: null,
	}),
	[actions.MQTT_CONNECTION_CONNECTED]: (state, action) => ({
		...state,
		connected: true,
		error: null,
		data: null,
		topic: null,
	}),
	[actions.MQTT_CONNECTION_DISCONNECTED]: (state, action) => ({
		...state,
		connected: false,
		error: null,
		data: null,
		topic: null,
	}),
	[actions.MQTT_MESSAGE_RECEIVED]: (state, action) => ({
		...state,
		connected: true,
		error: null,
		data: action.payload,
		topic: action.topic,
	}),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
	connected: false,
	error: null,
	data: null,
	topic: null,
};

export default function socketReducer(state = initialState, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}
