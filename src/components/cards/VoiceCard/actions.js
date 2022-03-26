import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { MainContext } from '../../../context';
import styles from './styles';
import NavigationService from '../../../routers/navigation';
import { usePlaybackControls, usePlayTrackEvent } from '../../../hooks/usePlaybackControls';

import APIConfig from '../../../api/const';
import axiosAjax from '../../../api/axiosConf';
import { showFlashMsg } from '../../../helpers/utils';
const ENDPOINTS = APIConfig.apiEndpoints;

const { width, height } = Dimensions.get('window');

function VoiceAction(props) {
	const { item, onRefresh, isBack } = props;
	const [loading, setLoading] = React.useState(false);
	const mainContext = React.useContext(MainContext);
	const playBackControls = usePlaybackControls();
	const { isTrackPlaying, curTrackId } = usePlayTrackEvent(item.voicenote_id);

	const { allRoom, updateAudioStatus, updateCurrentAudio } = mainContext;

	const deleteVoiceNote = async () => {
		try {
			setLoading(true);
			if (isTrackPlaying) {
				await playBackControls.destroy();
				updateAudioStatus(false);
				updateCurrentAudio(null);
			}
			const { data } = await axiosAjax({
				method: 'delete',
				url: ENDPOINTS.voiceNote(item.receiver_id, item.voicenote_id),
			});
			setLoading(false);
			onRefresh();
			if (isBack) {
				NavigationService.back();
			}
		} catch (error) {
			setLoading(false);
			showFlashMsg('Failed to delete voice note. Please try again', true);
		}
	};

	const onPauseAudio = () => {
		playBackControls.pause();
	};

	return (
		<View style={styles.footWrapper}>
			<TouchableOpacity
				style={styles.responseBtn}
				onPress={() => {
					if (isTrackPlaying) {
						onPauseAudio();
					}
					NavigationService.navigate('VoiceNoteModal', { id: item.user.user_id });
				}}
			>
				<Text style={[styles.headerName]}>Respond</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.responseBtn}
				onPress={deleteVoiceNote}
			>
				<Text style={[styles.headerName]}>Delete</Text>
			</TouchableOpacity>
			<Spinner visible={loading} />
		</View>
	);
}

export default React.memo(VoiceAction);