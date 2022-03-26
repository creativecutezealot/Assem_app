import * as actions from '../../actions/club/getListByClubId';
// ------------------------------------
// Reducer
// ------------------------------------

const getIndexFromPrevData = (dataList, action) => {
    var index = -1;
    if (dataList && Array.isArray(dataList) && dataList.length > 0 && action.data) {
        if (action.data.voicenote_id && action.data.voicenote_id !== '') {
            index = dataList.findIndex(
                a => a.voicenote_id == action.data.voicenote_id
            );
        } else if (action.data.audio_id && action.data.audio_id !== '') {
            index = dataList.findIndex(
                a => a.audio_id == action.data.audio_id
            );
        } else if (action.data.assemble_id && action.data.assemble_id !== '') {
            index = dataList.findIndex(
                a => a.assemble_id == action.data.assemble_id
            );
        } else if (action.data.event_id && action.data.event_id !== '') {
            index = dataList.findIndex(
                a => a.event_id == action.data.event_id
            );
        }
    }
    return index;
};

const initialState = {};
export function listGET(state = initialState, action) {
    const id = action.payload ? action.payload.id : '';
    if (action.type === actions.GET_LIST_BY_CLUB_REQUEST) {
        return {
            ...state,
            [id]: {
                loading: true,
                error: null,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else if (action.type === actions.GET_LIST_BY_CLUB_SUCCESS) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: null,
                data: action.data,
            },
        };
    } else if (action.type === actions.GET_LIST_BY_CLUB_FAILED) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: action.error,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else if (action.type === actions.ADD_LIST_BY_CLUB) {
        var dataList = state && state[id] ? state[id].data : [];
        const findIndex = getIndexFromPrevData(dataList, action);
        if (findIndex == -1) {
            dataList.push(action.data);
        }
        return {
            ...state,
            [id]: {
                loading: false,
                error: action.error,
                data: dataList,
            },
        };
    } else if (action.type === actions.UPDATE_LIST_BY_CLUB) {
        let dataList = state && state[id] ? state[id].data : [];
        const findIndex = getIndexFromPrevData(dataList, action);
        if (findIndex !== -1) {
            dataList[findIndex] = action.data;
        }
        return {
            ...state,
            [id]: {
                loading: false,
                error: action.error,
                data: dataList,
            },
        };
    } else if (action.type === actions.DEL_LIST_BY_CLUB) {
        let dataList = state && state[id] ? state[id].data : [];
        const findIndex = getIndexFromPrevData(dataList, action);
        if (findIndex !== -1) {
            dataList.splice(findIndex, 1);
        }
        return {
            ...state,
            [id]: {
                loading: false,
                error: action.error,
                data: dataList,
            },
        };
    } else {
        return state;
    }
}
