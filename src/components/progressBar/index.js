import React from 'react';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import SeekBar from '../seekbar';

export default class ProgressBar extends ProgressComponent {
    seekToAudio = progress => {
        const { duration } = this.state;
        const seekPosition = (progress / 100) * duration;
        TrackPlayer.seekTo(seekPosition);
    };
    render() {
        const { isCurrenTrack, showDes = true } = this.props;
        const { position, duration } = this.state;
        const progress = duration && position ? (position / duration) * 100 : 0;
        if (!isCurrenTrack) {
            return null;
        }
        return (
            <SeekBar
                min={0}
                max={100}
                progress={progress || 0}
                progressHeight={showDes ? 3 : 12}
                progressBackgroundColor={showDes ? '#FFFFFF9A' : '#FFFFFF00'}
                progressColor="#FFFFFF"
                thumbSize={showDes ? 16 : 1}
                thumbColor="#FFFFFF"
                thumbColorPressed="#FFFFFF"
                thumbStyle={
                    showDes
                        ? {
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              backgroundColor: 'white',
                          }
                        : {}
                }
                onProgressChanged={progress => this.seekToAudio(progress)}
            />
        );
    }
}
