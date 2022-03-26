import React from 'react';
import {
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { request as getListByClubIdRequest } from '../../actions/club/getListByClubId';
import { request as getClubByUserRequest } from '../../actions/club/getClubByUserId';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer, {
    STATE_PLAYING,
    STATE_READY,
} from 'react-native-track-player';
import {
    usePlaybackControls,
    usePlayTrackEvent,
} from '../../hooks/usePlaybackControls';
import Navigation from '../../routers/navigation';

import { withMainContext } from '../../context';
import styles from './styles';
import {
    HomeContainer,
    ProgressBar,
    ProgressTime,
    AudioDescription,
    VoiceAction,
    AudioPlayBtn,
} from '../../components/index';
import {
    converTimeToSecond,
} from '../../helpers/utils';
import axiosAjax from '../../api/axiosConf';
import APIConfig from '../../api/const';
import TopActions from './topActions';
import BottomActions from './bottomActions';

import { sortByIndexing, normalizeItem } from './utils';

const ENDPOINTS = APIConfig.apiEndpoints;
const { width, height } = Dimensions.get('window');

function AudioContainer(props) {
    const dispatch = useDispatch();
    const { audio } = props.navigation.state.params;

    const [loading, setLoading] = React.useState(true);
    const {
        context: { updateCurrentAudio, updateAudioStatus },
    } = props;
    const playBackControls = usePlaybackControls();
    const club = useSelector(state => state.currentClub.data);
    const item = React.useMemo(() => {
        if (!club) {
            return null;
        }
        if (
            (audio.audio_id && audio.audio_id !== '') ||
            (audio.voicenote_id && audio.voicenote_id !== '')
        ) {
            return normalizeItem(audio, club);
        } else {
            return audio;
        }
    }, [audio, club]);
    const { playState } = usePlayTrackEvent(item?.id);
    const [indexings, setIndexings] = React.useState([]);
    const [mounted, setMounted] = React.useState(false);
    const [curPosition, setCurPosition] = React.useState(null);

    React.useEffect(() => {
        if (item.id && club) {
            setUpCurrentTrack();
            getAudioIndexing();
            updateCurrentAudio(item);
        }
    }, [item.id, club]);

    React.useEffect(() => {
        if (playState === STATE_READY) {
            setLoading(false);
            if (curPosition) {
                setUpCurrentTrackPosition(curPosition);
            } else {
                playBackControls.play();
            }
        }
    }, [playState, curPosition]);

    const onRefresh = () => {
        if (club) {
            dispatch(
                getListByClubIdRequest({
                    id: club.club_id,
                })
            );
        }
        dispatch(
            getClubByUserRequest({
                id: global.currentUser.user_id,
            })
        );
    };

    const setUpCurrentTrack = async () => {
        const currenTrack = await TrackPlayer.getCurrentTrack();
        if (currenTrack && currenTrack === item.id) {
            setLoading(false);
            setMounted(true);
        } else {
            await playBackControls.setupTrack(item);
            getAudioPosition();
            setMounted(true);
        }
    };

    const setUpCurrentTrackPosition = async postion => {
        const currenTrack = await TrackPlayer.getCurrentTrack();
        if (currenTrack && currenTrack === item.id && !isNaN(postion)) {
            playBackControls.seekTo(Number(postion));
        }
        playBackControls.play();
    };

    const onSwitchAllAudio = () => {
        Navigation.setNavParam('Home', { isHideTab: true });
        Navigation.back();
        updateAudioStatus(true);
    };

    const getAudioIndexing = async () => {
        const { data } = await axiosAjax({
            method: 'get',
            url: ENDPOINTS.getAudioIndexing(item.id),
        });
        if (data.status && data.data) {
            setIndexings(data.data.sort(sortByIndexing));
        }
    };

    const getAudioPosition = async () => {
        const { data } = await axiosAjax({
            method: 'get',
            url: ENDPOINTS.getAudioPosition(item.id),
        });
        if (data.status && data.data) {
            if (!isNaN(data.data.play_time)) {
                setCurPosition(Number(data.data.play_time));
            }
        }
    };

    const seekToAudio = start_time => {
        const seekTimeSeconds = converTimeToSecond(start_time);
        playBackControls.seekTo(seekTimeSeconds);
    };

    const isShowLike = React.useMemo(() => {
        if (audio.audio_id && audio.audio_id !== '') {
            return true;
        }
        return false;
    }, [audio]);

    return (
        <HomeContainer
            onSwitchAllContent={onSwitchAllAudio}
            centerTitle="ALL CONTENT"
        >
            <TopActions />
            <View style={styles.audioContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (!loading) {
                            playBackControls.togglePlay();
                        }
                    }}
                >
                    <ImageBackground
                        source={{ uri: item.artwork }}
                        style={styles.imageContainer}
                        resizeMode="cover"
                    >
                        <AudioPlayBtn
                            isTrackPlaying={
                                !loading && playState === STATE_PLAYING
                            }
                            onPressPlay={() => {
                                if (!loading) {
                                    playBackControls.togglePlay();
                                }
                            }}
                        />
                    </ImageBackground>
                </TouchableOpacity>
                <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
                    <ProgressBar isCurrenTrack={true} showDes={true} />
                    <View style={{ height: 5 }} />
                    <ProgressTime isCurrenTrack={true} />
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ marginTop: 16 }}>
                        <AudioDescription
                            id={item.id}
                            likes_gained={audio?.likes_gained}
                            description={item.album}
                            isShowLike={isShowLike}
                        />
                    </View>
                    {audio.voicenote_id && audio.voicenote_id !== '' && (
                        <View>
                            <VoiceAction
                                item={audio}
                                onRefresh={onRefresh}
                                isBack={true}
                            />
                        </View>
                    )}
                    {indexings && indexings.length > 0 && (
                        <View style={styles.indexingContainer}>
                            {indexings.map(indexing => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            seekToAudio(indexing.start_time);
                                        }}
                                        key={indexing.sort_key}
                                        style={styles.indexingItem}
                                    >
                                        <View style={styles.indexingTime}>
                                            <Text
                                                style={styles.indexingTimeTxt}
                                            >
                                                {indexing.start_time}
                                            </Text>
                                        </View>
                                        <Text style={styles.indexingDes}>
                                            {indexing.description}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            </View>
            <BottomActions />
            <Spinner visible={loading} />
        </HomeContainer>
    );
}

export default withMainContext(AudioContainer);
