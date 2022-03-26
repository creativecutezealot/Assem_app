import React, {
	useState,
	useMemo,
	useRef,
	useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../routers/navigation';
import constVal from '../helpers/constant';

import { requestSuccess as updateViewerSucessRequest } from '../actions/viewer/updateViewer';
import { request as deleteViewerRequest } from '../actions/viewer/deleteViewer';
import { request as getListByClubIdRequest } from '../actions/club/getListByClubId';
import { deleteList as delListByClubIdRequest } from '../actions/club/getListByClubId';
import { leaveChannel } from '../helpers/agoraUtil';
import { destroyTrack } from '../hooks/usePlaybackControls';
import { getObjInfo, setObjInfo, showFlashMsg } from '../helpers/utils';
import APIConfig from '../api/const';
import axiosAjax from '../api/axiosConf';
import { normailzeQSData } from '../saga/normalize';
const ENDPOINTS = APIConfig.apiEndpoints;

export const SORT_TYPE = {
	none: 'none',
	assemble_all: 'assemble_all',
	assemble_live: 'assemble_live',
	audios: 'audios',
	voicenotes: 'voicenotes',
	events: 'events'
};

export const MainContext = React.createContext();

export function withMainContext(Component) {
	return function contextComponent(props) {
		return (
			<MainContext.Consumer>
				{context => <Component {...props} context={context} />}
			</MainContext.Consumer>
		);
	};
}

export default function MainContextProvider(props) {
	const dispatch = useDispatch();
	const isMount = useRef(false);
	const [currentViewer, setCurrentViewer] = useState(null);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [sortType, setSortType] = useState(SORT_TYPE.none);
	const [allRoom, setAllRoom] = useState(false);
	const [allowHostTab, setAllowHostTab] = useState(false);

	/// Audio Setting
	const [allAudio, setAllAudio] = useState(false);
	const [currentAudio, setCurrentAudio] = useState(null);

	const [allEvent, setAllEvent] = useState(false);

	const currentClubState = useSelector(state => state.currentClub.data);

	const currentClub = useMemo(() => {
		if (currentClubState) {
			return currentClubState;
		}
		return null;
	}, [currentClubState]);

	const toggleSortType = type => {
		console.log('@@@@@ change the type: ' + type);
		setSortType(type);
		onUpdateUser(type);
	};

	const onUpdateUser = async sort_type => {
		try {
			const { data } = await axiosAjax({
				method: 'patch',
				url: ENDPOINTS.updateUser(),
				data: normailzeQSData({
					sort_type,
				}),
			});
			if (data.status) {
				console.log('onUpdateUser: ', data);
				global.currentUser = data.data;
				await setObjInfo(constVal.USER_KEY, data.data);
			}
		} catch (error) {
			showFlashMsg('Failed to update sort type. Please try again', true);
		}
	};

	useMemo(() => {
		const getCurrentUser = async () => {
			const userInfo = await getObjInfo(constVal.USER_KEY);
			if (userInfo && userInfo.user_id !== '') {
				global.currentUser = userInfo;
				toggleSortType(userInfo.sort_type || SORT_TYPE.none);
			}
		};
		if (!isMount.current) {
			isMount.current = true;
			if (global.currentUser) {
				toggleSortType(global.currentUser.sort_type);
			} else {
				getCurrentUser();
			}
		}
	}, [global.currentUser, isMount.current]);

	const updateCurrentViewer = viewer => {
		// if (viewer) {
		// 	viewer.muted = viewer.handup ? false : true;
		// }
		setCurrentViewer(viewer);
		const payload = { id: global.currentUser.user_id };
		const updateData = { status: true, data: viewer };
		dispatch(updateViewerSucessRequest(updateData, payload));
	};

	const updateCurrentAudio = async audio => {
		if (!audio) {
			setAllAudio(false);
			await destroyTrack();
			Navigation.navigate('Home');
			Navigation.setNavParam('Home', { isHideTab: false });
		}
		setCurrentAudio(audio);
	};

	const updateAudioStatus = value => {
		setAllAudio(value);
	};

	const updateCurrentRoom = room => {
		setCurrentRoom(room);
	};

	const updateRoomStatus = value => {
		setAllRoom(value);
	};

	const updateEventStatus = value => {
		setAllEvent(value);
	};

	const updateAllowHostTab = () => {
		setAllowHostTab(!allowHostTab);
	};

	const updateLeavingStatus = value => {
		global.onlyLeaving = value;
	}

	const endHostRoomAction = useCallback(() => {
		if (currentClub) {
			dispatch(
				delListByClubIdRequest(currentRoom, { id: currentClub.club_id })
			);
			setTimeout(() => {
				dispatch(getListByClubIdRequest({ id: currentClub.club_id }));
			}, 1000);
		}
		leaveChannel();
		dispatch(
			deleteViewerRequest({
				id: global.currentUser.user_id,
				channel_id: currentRoom.assemble_id,
			})
		);
		updateRoomStatus(false);
		Navigation.navigate('Home');
		Navigation.setNavParam('Home', { isHideTab: false });
		updateCurrentViewer(null);
		updateCurrentRoom(null);
	}, [currentRoom, currentClub]);

	const endHostRoom = useCallback(async () => {
		if (currentViewer && currentRoom) {
			const room_id = currentRoom.assemble_id;
			try {
				const { data } = await axiosAjax({
					method: 'delete',
					url: ENDPOINTS.endAssemble(room_id),
				});
				endHostRoomAction();
			} catch (error) {
				showFlashMsg('Failed to end host room. Please try again', true);
			}
		}
	}, [currentRoom, currentViewer]);

	const leaveAudience = useCallback(() => {
		leaveChannel();
		if (global.onlyLeaving) {
			dispatch(
				deleteViewerRequest({
					id: global.currentUser.user_id,
					channel_id: currentRoom.assemble_id,
				})
			);
		}
		updateRoomStatus(false);
		Navigation.navigate('Home');
		Navigation.setNavParam('Home', { isHideTab: false });
		updateCurrentViewer(null);
		updateCurrentRoom(null);
	}, [currentRoom]);

	return (
		<MainContext.Provider
			value={{
				allowHostTab,
				allRoom,
				sortType,
				currentRoom,
				currentViewer,
				currentClub,
				allAudio,
				currentAudio,
				allEvent,
				toggleSortType,
				updateCurrentViewer,
				updateCurrentRoom,
				updateRoomStatus,
				updateAllowHostTab,
				endHostRoom,
				endHostRoomAction,
				leaveAudience,
				updateCurrentAudio,
				updateAudioStatus,
				updateLeavingStatus,
			}}
		>
			{props.children}
		</MainContext.Provider>
	);
}
