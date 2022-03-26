import React, {
    useContext,
    useState,
    useMemo,
    useEffect,
    forwardRef,
    memo,
    useRef,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import _flow from 'lodash.flow';
import { MainContext } from '../../context';
import styles from './styles';
import { SanityModal } from '../../components/index';
import Navigation from '../../routers/navigation';
import ForwardRef from '../../components/ForwardRef';
import EndRoomModal from './endRoomModal';

import { useDispatch, useSelector } from 'react-redux';

function TopActions(props) {
    const { containerStyle, forwardedRef } = props;

    const [endRoom, setEndRoom] = useState(false);
    const [showEndRoom, setShowEndRoom] = useState(false);
    const endRoomModalRef = useRef();

    const mainContext = useContext(MainContext);

    const dispatch = useDispatch();

    const {
        allRoom,
        currentClub,
        currentRoom,
        currentViewer,
        updateCurrentViewer,
        updateCurrentRoom,
        updateRoomStatus,
        endHostRoom,
        endHostRoomAction,
        leaveAudience,
        updateLeavingStatus,
    } = mainContext;

    const roomId = currentRoom ? currentRoom.assemble_id : '';
    const endAssemble = useSelector(state =>
        state.assembleDEL[roomId] ? state.assembleDEL[roomId].data : null
    );

    const showEndRoomModal = () => {
        if (endRoomModalRef && endRoomModalRef.current) {
            console.log('====================================== set leaving value');
            endRoomModalRef.current.show();
            updateLeavingStatus(true);
        }
    };

    useEffect(() => {
        if (endAssemble) {
            if (endAssemble.user_id !== global.currentUser.user_id) {
                setShowEndRoom(true);
            } else if (endAssemble.user_id === global.currentUser.user_id) {
                if (!endRoom) {
                    showEndRoomModal();
                }
            }
        }
    }, [endAssemble]);

    const goBack = () => {
        Navigation.setNavParam('Home', { isHideTab: false });
        Navigation.back();
    };

    const isHost = useMemo(() => {
        let isHost = false;
        if (currentRoom && currentViewer) {
            if (currentViewer.user_id === currentRoom.user_id) {
                isHost = true;
            }
        }
        return isHost;
    }, [currentViewer, currentRoom]);

    return (
        <View
            style={[
                styles.headerContainer,
                allRoom && styles.headerAllRoomContainer,
            ]}
        >
            {allRoom ? (
                <TouchableOpacity
                    onPress={() => {
                        Navigation.navigate('Assembly', { startCall: false });
                        updateRoomStatus(false);
                    }}
                    style={styles.allRoomContainer}
                >
                    <View style={styles.backRoomContainer}>
                        <FontAwesome5Pro
                            name="arrow-alt-up"
                            solid
                            style={styles.backRoomIcon}
                        />
                        <Text style={styles.backRoomTitle}>BACK TO ROOM</Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={[styles.headerTitle, { width: '100%' }]}
                    >
                        {currentRoom?.assemble_name}
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text numberOfLines={2} style={styles.headerTitle}>
                    {currentRoom?.assemble_name}
                </Text>
            )}
            <TouchableOpacity
                style={styles.footerIconContainer}
                onPress={showEndRoomModal}
            >
                <FontAwesome5Pro
                    name="times-circle"
                    style={styles.footerIconRes}
                    light
                />
                <Text style={styles.footerLbl}>
                    {isHost ? 'End\nRoom' : 'Leave\nRoom'}
                </Text>
            </TouchableOpacity>
            <EndRoomModal ref={endRoomModalRef} onEndCallBack={goBack} />
            <SanityModal
                cancelText={`I'll stay`}
                hasClose={false}
                show={showEndRoom}
                msg={'The Host has ended this Room.'}
                onCancel={() => {
                    setShowEndRoom(false);
                    endHostRoomAction();
                    setTimeout(() => {
                        goBack();
                    }, 1000);
                }}
                onConfirm={() => {
                    setShowEndRoom(false);
                    endHostRoomAction();
                    setTimeout(() => {
                        goBack();
                    }, 1000);
                }}
            />
        </View>
    );
}
export default _flow([memo, ForwardRef, forwardRef])(TopActions);
