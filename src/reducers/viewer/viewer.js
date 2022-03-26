import * as actionsPOST from '../../actions/viewer/createViewer';
import * as actionsGET from '../../actions/viewer/getViewer';
import * as actionsPATCH from '../../actions/viewer/updateViewer';
import * as actionsDEL from '../../actions/viewer/deleteViewer';
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [actionsPOST.POST_VIEWER_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data:
                state.viewerData && state.viewerData[action.payload.id]
                    ? state.viewerData[action.payload.id].data
                    : null,
        },
    }),
    [actionsPOST.POST_VIEWER_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actionsPOST.POST_VIEWER_FAILED]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: false,
            error: action.error,
            data: null,
        },
    }),
    [actionsGET.GET_VIEWER_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data:
                state.viewerData && state.viewerData[action.payload.id]
                    ? state.viewerData[action.payload.id].data
                    : null,
        },
    }),
    [actionsGET.GET_VIEWER_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actionsGET.GET_VIEWER_FAILED]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: false,
            error: action.error,
            data: null,
        },
    }),
    [actionsPATCH.PATCH_VIEWER_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data:
                state.viewerData && state.viewerData[action.payload.id]
                    ? state.viewerData[action.payload.id].data
                    : null,
        },
    }),
    [actionsPATCH.PATCH_VIEWER_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actionsPATCH.PATCH_VIEWER_FAILED]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: false,
            error: action.error,
            data: null,
        },
    }),
    [actionsDEL.DELETE_VIEWER_REQUEST]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: true,
            loaded: false,
            error: null,
            data: null,
        },
    }),
    [actionsDEL.DELETE_VIEWER_SUCCESS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            loading: false,
            loaded: true,
            error: null,
            data: action.data,
        },
    }),
    [actionsDEL.DELETE_VIEWER_FAILED]: (state, action) => ({
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
const initialState = {
    loading: false,
    loaded: false,
    error: null,
    data: null,
};

export function viewerData(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
