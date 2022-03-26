import * as actions from '../../actions/event/inviteEvent';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.INVITE_EVENT_UPDATE]: (state, action) => ({
        ...state,
        data: action.data,
    }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    data: null,
};

export function inviteEvent(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
