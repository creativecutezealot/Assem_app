import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import styles from './styles';
import constants from '../../../styles/const';
import { getDisplayName } from '../../../helpers/utils';
const limitStrLen = 60;

const img_person = require('../../../assets/images/home/active_person.png');
const { width, height } = Dimensions.get('window');
import moment from 'moment-timezone';

function eventHeader({ event }) {

    const [moreStg, setMoreStg] = useState(false);

    // const hostViewer = viewers.filter(viewer => viewer.user_id === event.host_id);
    // const otherViews = viewers.filter(viewer => viewer.user_id !== event.host_id);
    // const reorderedViewers = [...hostViewer, ...otherViews];
    // const stageViewersStr = `On Stage: ${reorderedViewers.map(a => getDisplayName(a.first_name + a.last_name)).join('  ')}`;
    // const isLess = stageViewersStr.length > limitStrLen && !moreStg;
    // const showStr = isLess ? `${stageViewersStr.substring(0, limitStrLen)}...` : stageViewersStr;
    // const moreLessStyle = { fontSize: 14, color: constants.colors.primary_blue, marginLeft: 16 };
    const startTime = moment.tz(event.event_time, 'America/Los_Angeles');
    const startHour = startTime.format('hh:mm A');
    const startDay = startTime.format('MM/DD');
    const startTimeZone = startTime.zoneName();
    const currentTime = moment().tz('America/Los_Angeles');
    const day = currentTime.format('MM/DD') === startDay ? 'Today' : startDay;
    const showStr = `When: ${day} ${startHour} ${startTimeZone}`;
    return (
        <View style={[styles.headerWrapper, { paddingHorizontal: 16 }]}>
            <View style={styles.labelWrapper}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.headerName]}>
                    {event.event_name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                    <View style={{ width: width * 0.8 }}>
                        <Text
                            style={styles.name}>
                            {showStr}{'   '}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default eventHeader;