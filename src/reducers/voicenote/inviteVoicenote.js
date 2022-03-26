import * as actions from '../../actions/voicenote/inviteVoicenote';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.INVITE_VOICENOTE_UPDATE]: (state, action) => ({
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

export function inviteVoicenote(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
