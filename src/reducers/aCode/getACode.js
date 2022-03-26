import * as actions from '../../actions/aCode/getACode';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.GET_ACODE_REQUEST]: (state, action) => ({
        ...state,
        loading: true,
        loaded: false,
        error: null,
        data: null,
    }),
    [actions.GET_ACODE_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.data,
    }),
    [actions.GET_ACODE_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        data: null,
    }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    loaded: false,
    error: null,
    data: null,
};

export function aCodeGET(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
