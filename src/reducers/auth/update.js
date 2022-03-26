import * as actions from '../../actions/auth/update';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.PATCH_USER_REQUEST]: state => ({
        ...state,
        loading: true,
        loaded: false,
        error: null,
        data: null,
    }),
    [actions.PATCH_USER_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.data,
    }),
    [actions.PATCH_USER_FAILED]: (state, action) => ({
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

export function userPATCH(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
