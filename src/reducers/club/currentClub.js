import * as actions from '../../actions/club/currentClub';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.CURRENT_CLUB_UPDATE]: (state, action) => ({
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

export function currentClub(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
