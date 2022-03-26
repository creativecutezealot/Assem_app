import React from 'react';
import PlayIndicator from './playIndicator';
import TransButton from '../../transbutton';

function AudioPlayBtn(props) {
	const { isTrackPlaying, onPressPlay } = props;
	return (
		<>
			{isTrackPlaying ? (
				<PlayIndicator />
			) : (
				<TransButton
					onPress={onPressPlay}
					iconName={isTrackPlaying ? 'pause-circle' : 'play-circle'}
					title={isTrackPlaying ? ' PAUSE' : ' PLAY'}
					iconType={0}
					disabled={isTrackPlaying}>
				</TransButton>
			)}
		</>
	);
}

export default React.memo(AudioPlayBtn);