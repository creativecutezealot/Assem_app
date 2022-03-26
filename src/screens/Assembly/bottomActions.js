import React, {
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import styles from './styles';
import constants from '../../styles/const';
import { MainContext } from '../../context';
import { SanityModal, ActionBtns } from '../../components/index';

import { useDispatch } from 'react-redux';
import { request as updateViewerRequest } from '../../actions/viewer/updateViewer';

import { showFlashMsg } from '../../helpers/utils';
import { muteAudio } from '../../helpers/agoraUtil';
import axiosAjax from '../../api/axiosConf';
import APIConfig from '../../api/const';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;

function BottomActions(props) {
    const { containerStyle = {} } = props;
    const [showHandDown, setShowHandDown] = useState(false);
    const [showMuteWarn, setShowMuteWarn] = useState(false);
    const [like, setLike] = useState(false);
    const mainContext = useContext(MainContext);

    const dispatch = useDispatch();

    const {
        allRoom,
        allowHostTab,
        currentRoom,
        currentViewer,
        updateCurrentViewer,
        updateCurrentRoom,
        updateAllowHostTab,
        toggleSortType
    } = mainContext;

    const [muteColor, handselect, handup, muted, isHost] = useMemo(() => {
        let isHost = false;
        let muteColor = 'white';
        let muted = false;
        let handselect = false;
        let handup = false;
        if (currentViewer) {
            if (currentViewer.muted) {
                muteColor = constants.colors.primary_red;
            }
            muted = currentViewer.muted;
            handup = currentViewer.handup;
            handselect = currentViewer.handselect;
            if (currentRoom) {
                if (currentViewer.user_id === currentRoom.user_id) {
                    isHost = true;
                }
            }
        }
        return [muteColor, handselect, handup, muted, isHost];
    }, [currentViewer, currentRoom]);

    useEffect(() => {
        if (currentViewer) {
            if (currentViewer.handselect) {
                muteAudio(currentViewer.muted);
            } else {
                if (currentViewer.user_id === currentRoom.user_id) {
                    /// if host
                    muteAudio(currentViewer.muted);
                } else {
                    muteAudio(true);
                }
            }
        }
    }, [currentViewer, currentRoom]);

    const onHandDownViewer = useCallback(() => {
        if (currentViewer) {
            let newCurrentViewer = { ...currentViewer };
            newCurrentViewer.handselect = !currentViewer.handselect;
            newCurrentViewer.muted = true;
            updateCurrentViewer(newCurrentViewer);
            dispatch(
                updateViewerRequest({
                    id: currentViewer.viewer_id,
                    handselect: !currentViewer.handselect,
                    muted: true,
                    handup: false,
                })
            );
        }
    }, [currentViewer]);

    const onHandUpViewer = useCallback(() => {
        if (currentViewer) {
            let newCurrentViewer = { ...currentViewer };
            newCurrentViewer.handup = !currentViewer.handup;
            // newCurrentViewer.muted = false;
            updateCurrentViewer(newCurrentViewer);
            dispatch(
                updateViewerRequest({
                    id: currentViewer.viewer_id,
                    // handselect: !currentViewer.handselect,
                    handup: !currentViewer.handup,
                    // muted: false
                })
            );
        }
    }, [currentViewer]);

    const postLike = useCallback(async () => {
        if (!currentRoom) {
            return;
        }
        try {
            var likes_gained = 1;
            if (like) {
                likes_gained = -1;
            }
            setLike(!like);
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.createUserLike(),
                data: normailzeQSData({
                    opposite_id: currentRoom.user_id,
                    likes_gained,
                }),
            });
            setTimeout(() => {
                setLike(false);
            }, 2500);
        } catch (error) {
            console.log('@@@@@ error', error);
            showFlashMsg(
                'Failed to post like of this room. Please try again',
                true
            );
        }
    }, [currentRoom]);

    const onMute = useCallback(() => {
        console.log('@@@@@onMute: ', currentViewer, isHost);
        if (isHost || (currentViewer && currentViewer.handselect)) {
            let newCurrentViewer = { ...currentViewer };
            newCurrentViewer.muted = !currentViewer.muted;
            dispatch(
                updateViewerRequest({
                    id: currentViewer.viewer_id,
                    muted: !currentViewer.muted,
                })
            );
            updateCurrentViewer(newCurrentViewer);
            muteAudio(!currentViewer.muted);
        } else {
            console.log('@@@@@onMute1: ', currentViewer);
            if (currentViewer && !currentViewer.handselect) return;
            setShowMuteWarn(true);
        }
    }, [currentRoom, currentViewer, isHost]);

    const onAllowHost = useCallback(() => {
        if (isHost) {
            updateAllowHostTab(!allowHostTab);
            dispatch(
                updateViewerRequest({
                    id: currentViewer.viewer_id,
                    host_allow: !allowHostTab,
                })
            );
        } else {
            if (currentViewer && currentViewer.handselect) {
                setShowHandDown(true);
            } else {
                onHandUpViewer();
            }
        }
    }, [currentRoom, currentViewer, isHost, allowHostTab]);

    return (
        <View
            style={[
                styles.footerWrapper,
                allRoom && styles.footerAllRoomWrapper,
            ]}
        >
            <TouchableOpacity
                style={styles.footerIconContainer}
                onPress={postLike}
            >
                <FontAwesome5Pro
                    name="thumbs-up"
                    style={styles.footerIconWhite}
                    light={!like}
                    solid={like}
                />
                <Text style={styles.footerLbl}>{'Like\n '}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerIconContainer, { marginHorizontal: 36 }]}
                onPress={onAllowHost}
            >
                {isHost ? (
                    <FontAwesome5Pro
                        name={'sort-alt'}
                        style={allowHostTab ? [styles.footerIconWhite, { color: constants.colors.primary_red}] : styles.footerIconWhite }
                        light
                    />
                ) : handselect ? (
                    <FontAwesome5Pro
                        name={'arrow-alt-down'}
                        style={styles.footerIconWhite}
                        light
                    />
                ) : (
                    <FontAwesome5Pro
                        name={'arrow-alt-up'}
                        style={styles.footerIconWhite}
                        light={!handup}
                        solid={handup}
                    />
                )}
                <Text style={styles.footerLbl}>
                    {isHost
                        ? 'MOVE\n'
                        : handselect
                        ? 'MOVE\nAUDIENCE'
                        : 'REQUEST\nSTAGE'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.footerIconContainer}
                onPress={onMute}
            >
                <FontAwesome5Pro
                    name={muted ? 'microphone-slash' : 'microphone'}
                    style={[styles.footerIconWhite, { color: muteColor }]}
                    light
                />
                <Text style={styles.footerLbl}>
                    {muted ? 'Muted\n' : 'Mute\n'}
                </Text>
            </TouchableOpacity>
            <ActionBtns toggleSortType={toggleSortType} />
            <SanityModal
                show={showHandDown}
                cancelText={`I'll stay`}
                hasClose={false}
                msg={'Do you want to move to the Audience?'}
                onCancel={() => {
                    setShowHandDown(false);
                }}
                onConfirm={() => {
                    setShowHandDown(false);
                    onHandDownViewer();
                }}
            />
            <SanityModal
                show={showMuteWarn}
                // cancelText={`I'll stay`}
                hasClose={false}
                msg={
                    'Members are muted in the Audience. You can request to join the Stage to speak.'
                }
                onCancel={() => {
                    setShowMuteWarn(false);
                }}
                onConfirm={() => {
                    setShowMuteWarn(false);
                }}
            />
        </View>
    );
}
export default BottomActions;
