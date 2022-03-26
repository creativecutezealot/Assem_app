import * as actions from '../../actions/viewer/getViewerByAssemble';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.GET_VIEWER_BY_ASSEMBLE_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data: null,
        },
    }),
    [actions.GET_VIEWER_BY_ASSEMBLE_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actions.GET_VIEWER_BY_ASSEMBLE_FAILED]: (state, action) => ({
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

export function viewersData(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
