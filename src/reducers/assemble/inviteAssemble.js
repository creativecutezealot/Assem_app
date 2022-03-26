import * as actions from '../../actions/assemble/inviteAssemble';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actions.INVITE_ASSEMBLE_UPDATE]: (state, action) => ({
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

export function inviteAssemble(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
