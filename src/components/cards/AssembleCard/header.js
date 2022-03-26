import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import styles from './styles';
import constants from '../../../styles/const';
import { getDisplayName } from '../../../helpers/utils';
const limitStrLen = 60;

const img_person = require('../../../assets/images/home/active_person.png');
const { width, height } = Dimensions.get('window');

function assembleHeader({ room, assemble, viewers = [] }) {

    const [moreStg, setMoreStg] = useState(false);

    const hostViewer = viewers.filter(viewer => viewer.user_id === assemble.host_id);
    const otherViews = viewers.filter(viewer => viewer.user_id !== assemble.host_id);
    const reorderedViewers = [...hostViewer, ...otherViews];
    const stageViewersStr = `On Stage: ${reorderedViewers.map(a => getDisplayName(a.first_name + a.last_name)).join('  ')}`;
    const isLess = stageViewersStr.length > limitStrLen && !moreStg;
    const showStr = isLess ? `${stageViewersStr.substring(0, limitStrLen)}...` : stageViewersStr;
    const moreLessStyle = { fontSize: 14, color: constants.colors.primary_blue, marginLeft: 16 };
    return (
        <View style={[styles.headerWrapper, { paddingHorizontal: 16 }]}>
            <View style={styles.labelWrapper}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.headerName]}>
                    {assemble.assemble_name}
                </Text>
                {viewers.length > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                        <View style={{ width: width * 0.8 }}>
                            <Text
                                style={styles.name}>
                                {showStr}{'   '}
                                {
                                    stageViewersStr.length > limitStrLen && (
                                        isLess ? <Text onPress={() => {
                                            setMoreStg(!moreStg);
                                        }} style={[styles.headerName, moreLessStyle]}>{'MORE'}</Text> :
                                            <Text onPress={() => {
                                                setMoreStg(!moreStg);
                                            }} style={[styles.headerName, moreLessStyle]}>{'LESS'}</Text>
                                    )
                                }
                            </Text>

                        </View>
                        <Text style={styles.name}>{viewers?.length} <FontAwesome5Pro name="users" style={styles.users} solid /></Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default assembleHeader;