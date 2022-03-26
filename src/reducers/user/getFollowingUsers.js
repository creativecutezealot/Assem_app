import * as actions from '../../actions/user/getFollowingUsers';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.GET_FOLLOWING_USERS_REQUEST]: state => ({
        ...state,
        loading: true,
        loaded: false,
        error: null,
        data: state.usersFollowingGET ? state.usersFollowingGET.data : null,
    }),
    [actions.GET_FOLLOWING_USERS_SUCCESS]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.data,
    }),
    [actions.GET_FOLLOWING_USERS_FAILED]: (state, action) => ({
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

export function usersFollowingGET(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
