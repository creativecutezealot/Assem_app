import * as actions from '../../actions/event/getEvent';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.GET_EVENT_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data: null,
        },
    }),
    [actions.GET_EVENT_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actions.GET_EVENT_FAILED]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: false,
            error: action.error,
            data: null,
        },
    }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export function eventGET(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
