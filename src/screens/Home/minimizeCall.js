import React from 'react';
import {
    View,
} from 'react-native';
import { withMainContext } from '../../context';
import BottomActions from '../Assembly/bottomActions';
import TopActions from '../Assembly/topActions';
import styles from './styles';

function MinizeCall(props) {
    const { context, onChangeBottomHeight } = props;
    const { allRoom } = context;
    if (!allRoom) {
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
export default withMainContext(MinizeCall);
