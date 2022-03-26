import React, {
    useContext,
    useState,
    useRef,
    forwardRef,
    memo,
    useImperativeHandle,
} from 'react';
import _flow from 'lodash.flow';
import { MainContext } from '../../context';
import { SanityModal } from '../../components/index';
import ForwardRef from '../../components/ForwardRef';

const AUDIO_END_MSG = 'Are you sure you want to end this Audio?';

function EndAudioModal(props) {
    const { onEndCallBack = () => {}, forwardedRef } = props;

    const [showModal, setShowModal] = useState(false);
    const callBackRef = useRef(null);

    const mainContext = useContext(MainContext);

    const {
        allAudio,
        currentClub,
        currentAudio,
        updateCurrentAudio,
        updateAudioStatus,
    } = mainContext;

    useImperativeHandle(forwardedRef, () => ({
        show: (callBack = () => {}) => {
            callBackRef.current = callBack;
            if (!showModal) {
                setShowModal(true);
            }
        },
    }));

    return (
        <SanityModal
            show={showModal}
            msg={AUDIO_END_MSG}
            hasClose={false}
            confirmText={'End audio'}
            cancelText={`I'll stay`}
            onCancel={() => {
                setShowModal(false);
            }}
            onConfirm={() => {
                setShowModal(false);
                updateCurrentAudio(null);
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
export default _flow([memo, ForwardRef, forwardRef])(EndAudioModal);
