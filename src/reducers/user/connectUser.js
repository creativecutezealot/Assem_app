import * as actions from '../../actions/user/connectUser';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.POST_CONNECT_USER_REQUEST]: state => ({
        ...state,
        loading: true,
        loaded: false,
        error: null,
        data: null,
    }),
    [actions.POST_CONNECT_USER_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.data,
    }),
    [actions.POST_CONNECT_USER_FAILED]: (state, action) => ({
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

export function connectUserPOST(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
