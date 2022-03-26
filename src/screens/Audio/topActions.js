import React, {
    useContext,
    useState,
    forwardRef,
    memo,
    useRef,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import _flow from 'lodash.flow';
import { MainContext } from '../../context';
import styles from './styles';
import Navigation from '../../routers/navigation';
import ForwardRef from '../../components/ForwardRef';
import { usePlaybackControls } from '../../hooks/usePlaybackControls';
import EndAudioModal from './endAudioModal';

import { useDispatch } from 'react-redux';

function TopActions(props) {
    const { containerStyle, forwardedRef } = props;
    const playBackControls = usePlaybackControls();
    const [endAudio, setEndAudio] = useState(false);

    const mainContext = useContext(MainContext);
    const endAudioModalRef = useRef();

    const dispatch = useDispatch();

    const { currentAudio, allAudio, updateAudioStatus } = mainContext;

    const showEndRoomModal = () => {
        if (endAudioModalRef && endAudioModalRef.current) {
            endAudioModalRef.current.show(onEndAudio);
        }
    };

    const onEndAudio = () => {
        playBackControls.destroy();
        Navigation.back();
    };

    return (
        <View
            style={[
                styles.headerContainer,
                allAudio && styles.headerAllAudioContainer,
            ]}
        >
            {allAudio ? (
                <TouchableOpacity
                    onPress={() => {
                        Navigation.navigate('AudioPlayer', {
                            audio: currentAudio,
                        });
                        updateAudioStatus(false);
                    }}
                    style={styles.allAudioContainer}
                >
                    <View style={styles.backAudioContainer}>
                        <FontAwesome5Pro
                            name="arrow-alt-up"
                            solid
                            style={styles.backAudioIcon}
                        />
                        <Text style={styles.backAudioTitle}>BACK TO AUDIO</Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.headerTitle, { width: '100%' }]}
                    >
                        {currentAudio?.title}
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.headerTitle}
                >
                    {currentAudio?.title}
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
                <Text style={styles.footerLbl}>{'Close\nAudio'}</Text>
            </TouchableOpacity>
            <EndAudioModal ref={endAudioModalRef} />
        </View>
    );
}
export default _flow([memo, ForwardRef, forwardRef])(TopActions);
