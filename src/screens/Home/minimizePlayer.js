import React from 'react';
import {
    View,
} from 'react-native';
import { withMainContext } from '../../context';

import BottomActions from '../Audio/bottomActions';
import TopActions from '../Audio/topActions';
import styles from './styles';

function MinizePlayer(props) {
    const { onChangeBottomHeight, context } = props;
    const { allAudio } = context;
    if (!allAudio) {
        return null;
    }
    return (
        <View
            onLayout={e => {
                const { height } = e.nativeEvent.layout;
                onChangeBottomHeight(height);
            }}
            style={styles.allRoomContainer}
        >
            <View style={styles.allRoomControlContainer}>
                <TopActions
                    containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
                />
            </View>
            <BottomActions containerStyle={{ position: 'relative' }} />
        </View>
    );
}
export default withMainContext(MinizePlayer);
