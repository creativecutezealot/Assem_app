import React, {
    useContext,
    useState,
    useMemo,
    useRef,
    forwardRef,
    memo,
    useImperativeHandle,
} from 'react';
import _flow from 'lodash.flow';
import { MainContext } from '../../context';
import { SanityModal } from '../../components/index';
import ForwardRef from '../../components/ForwardRef';

const HOST_END_MSG = 'Are you sure you want to end this Room?';
const AUDIENCE_END_MSG = 'Are you sure you want to leave this Room?';

function EndRoomModal(props) {
    const { onEndCallBack = () => {}, forwardedRef } = props;

    const [showModal, setShowModal] = useState(false);
    const callBackRef = useRef(null);

    const mainContext = useContext(MainContext);

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
    } = mainContext;

    useImperativeHandle(forwardedRef, () => ({
        show: (callBack = () => {}) => {
            callBackRef.current = callBack;
            if (!showModal) {
                setShowModal(true);
            }
        },
    }));

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
        <SanityModal
            show={showModal}
            hasClose={false}
            confirmText={isHost ? 'End room' : 'Leave room'}
            cancelText={`I'll stay`}
            msg={isHost ? HOST_END_MSG : AUDIENCE_END_MSG}
            onCancel={() => {
                setShowModal(false);
            }}
            onConfirm={() => {
                setShowModal(false);
                if (isHost) {
                    endHostRoom();
                } else {
                    leaveAudience();
                }
                onEndCallBack();
                if (
                    callBackRef.current &&
                    typeof callBackRef.current === 'function'
                ) {
                    callBackRef.current();
                }
            }}
        />
    );
}
export default _flow([memo, ForwardRef, forwardRef])(EndRoomModal);
