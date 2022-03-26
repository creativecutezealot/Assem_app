import * as actions from '../../actions/audio/updateAudio';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.PATCH_AUDIO_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data: null,
        },
    }),
    [actions.PATCH_AUDIO_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actions.PATCH_AUDIO_FAILED]: (state, action) => ({
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

export function audioPATCH(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
