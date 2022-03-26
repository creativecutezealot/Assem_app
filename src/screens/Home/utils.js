import { SORT_TYPE } from '../../context';
import R from 'ramda';
import moment from 'moment-timezone';
import RNCallKeep from 'react-native-callkeep';
import { initRtcEngine, leaveChannel } from '../../helpers/agoraUtil';

export const getSortedData = (sortType, listData = [], club) => {
    if (listData && Array.isArray(listData) && club) {
        var sortedData = R.clone(listData);
        if (sortType === SORT_TYPE.audios) {
            console.log('@@@@@ sortedData1:');
            sortedData = sortedData.filter(
                a => a.audio_id && a.audio_id !== '' && !a.is_sent_message
            );
            sortedData = sortedData.filter(
                a =>
                    a.is_allow_all ||
                    (a.selected_users &&
                        a.selected_users.includes(global.currentUser.user_id))
            );
            let pinnedData = sortedData.filter(a => a.is_pinned);
            pinnedData = pinnedData.sort((a, b) => {
                return (
                    new Date(b.pinned_at).getTime() -
                    new Date(a.pinned_at).getTime()
                );
            });
            let unPinnedData = sortedData.filter(a => !a.is_pinned);
            unPinnedData = unPinnedData.sort((a, b) => {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            });
            sortedData = [...pinnedData, ...unPinnedData];
            const listAudios = sortedData.filter(
                a => a.audio_id && a.audio_id !== ''
            );
            const nonAudios = sortedData.filter(
                a => !a.audio_id || a.audio_id === ''
            );
            sortedData = [...listAudios, ...nonAudios];
        } else if (sortType === SORT_TYPE.voicenotes) {
            var voiceNotes = sortedData.filter(
                a =>
                    a.voicenote_id &&
                    a.voicenote_id !== '' &&
                    a.receiver_id === global.currentUser.user_id
            );
            let pinnedData = voiceNotes.filter(a => a.is_pinned);
            pinnedData = pinnedData.sort((a, b) => {
                return (
                    new Date(b.pinned_at).getTime() -
                    new Date(a.pinned_at).getTime()
                );
            });
            let unPinnedData = voiceNotes.filter(a => !a.is_pinned);
            unPinnedData = unPinnedData.sort((a, b) => {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            });
            sortedData = [...pinnedData, ...unPinnedData];
            const listVoiceNotes = sortedData.filter(
                a => a.voicenote_id && a.voicenote_id !== ''
            );
            const nonVoiceNotes = sortedData.filter(
                a => !a.voicenote_id || a.voicenote_id === ''
            );
            sortedData = [...listVoiceNotes, ...nonVoiceNotes];
        } else if (sortType === SORT_TYPE.events) {
            sortedData = sortedData.filter(
                a => a.event_id && a.event_id !== '' && a.enter_club_id === club.club_id
            ).sort((a, b) => {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            });
        } else {
            sortedData = sortedData.filter(
                a => a.assemble_id && a.assemble_id !== ''
            );
            sortedData = sortedData.filter(
                a =>
                    a.is_allow_all ||
                    (a.selected_users &&
                        a.selected_users.includes(global.currentUser.user_id))
            );
            let pinnedData = sortedData.filter(a => a.is_pinned);
            pinnedData = pinnedData.sort((a, b) => {
                return (
                    new Date(b.pinned_at).getTime() -
                    new Date(a.pinned_at).getTime()
                );
            });
            let unPinnedData = sortedData.filter(a => !a.is_pinned);
            unPinnedData = unPinnedData.sort((a, b) => {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            });
            sortedData = [...pinnedData, ...unPinnedData];
            const listAssembles = sortedData.filter(
                a => a.assemble_id && a.assemble_id !== ''
            );
            const nonAssembles = sortedData.filter(
                a => !a.assemble_id || a.assemble_id === ''
            );
            sortedData = [...listAssembles, ...nonAssembles];
        }
        return sortedData;
    }
    return [];
};

export const isValidStart = item => {
    const startTime = moment.tz(item.start_time, 'America/Los_Angeles');
    const currrentTime = moment().tz('America/Los_Angeles');
    const user_includs =
        item.is_allow_all ||
        (item.selected_users &&
            item.selected_users.includes(global.currentUser.user_id));
    const isStarted = typeof item.is_immediately === 'string' ? item.is_immediately === 'true' : item.is_immediately || startTime.unix() < currrentTime.unix();
    if (!user_includs) {
        return false;
    }
    return isStarted;
};

export const setUpCallKit = () => {
    RNCallKeep.setup({
        ios: {
            appName: 'Assembly',
        },
        android: {
            alertTitle: 'Permissions required',
            alertDescription:
                'This application needs to access your phone accounts',
            cancelButton: 'Cancel',
            okButton: 'ok',
        },
    });
};

export const initAgora = async () => {
    await initRtcEngine();
};
