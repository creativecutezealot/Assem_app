import * as actions from '../../actions/viewer/deleteViewer';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.DELETE_VIEWER_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data: null,
        },
    }),
    [actions.DELETE_VIEWER_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actions.DELETE_VIEWER_FAILED]: (state, action) => ({
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

export function viewerDEL(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
