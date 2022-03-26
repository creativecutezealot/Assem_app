import * as actions from '../../actions/user/likeUser';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.LIKE_USER_UPDATE]: (state, action) => ({
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

export function likeUser(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
