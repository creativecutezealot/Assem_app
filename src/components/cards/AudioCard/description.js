import React from 'react';
import { View, Text } from 'react-native';
import FontAwesomePro from 'react-native-vector-icons/FontAwesome5Pro';
import Hyperlink from 'react-native-hyperlink';
import Touchable from '../../touchable';
import styles from './styles';
import constants from '../../../styles/const';

import APIConfig from '../../../api/const';
import axiosAjax from '../../../api/axiosConf';
import { normailzeQSData } from '../../../saga/normalize';
import { showFlashMsg } from '../../../helpers/utils';
const ENDPOINTS = APIConfig.apiEndpoints;

const limitStrLen = 80;

function AudioDescription(props) {
    const { id, likes_gained, description, isShowLike = true } = props;
    const [like, setLike] = React.useState(false);
    const [likeGains, setLikeGains] = React.useState(likes_gained || 0);
    const [moreDes, setMoreDes] = React.useState(false);

    React.useEffect(() => {
        if (isShowLike) {
            getLike(id);
        }
    }, [id, isShowLike]);

    const getLike = async (id) => {
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getAudioLike(id),
            });
            if (data.status && likes_gained > 0) {
                setLike(true);
            }
        } catch (error) {
        }
    };

    const postLike = async () => {
        try {
            var likes_gained = 1;
            if (like) {
                likes_gained = -1;
                if (likeGains > 0) {
                    setLikeGains(likeGains + likes_gained);
                }
            } else {
                setLikeGains(likeGains + likes_gained);
            }
            setLike(!like);
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.createAudioLike(),
                data: normailzeQSData({ audio_id: id, likes_gained })
            });
        } catch (error) {
            showFlashMsg('Failed to post like for this audio. Please try again', true);
        }
    };

    return (
        <React.Fragment>
            {isShowLike && (
                <View style={styles.footWrapper}>
                    <Touchable onPress={postLike} >
                        <View style={styles.footerLeftWrapper}>
                            <FontAwesomePro name="thumbs-up" style={styles.like} light={!like} solid={like} />
                        </View>
                    </Touchable>
                    <Text style={[styles.headerName, { marginLeft: 10, marginTop: 8 }]}>{likeGains} likes</Text>
                </View>
            )}
            {description !== '' &&
                <View style={styles.descriptionWrapper}>
                    <Hyperlink linkDefault={true} linkStyle={{ color: constants.colors.primary_blue }}>
                        <Text style={styles.name}>{description.length > limitStrLen && !moreDes ? `${description.substring(0, limitStrLen)}...` : description}</Text>
                    </Hyperlink>
                    {description.length > limitStrLen && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', marginTop: 16 }}>
                            <Text onPress={() => {
                                setMoreDes(!moreDes);
                            }} style={[styles.headerName, { fontSize: 14 }]}>{!moreDes ? 'MORE' : 'LESS'}</Text>
                        </View>
                    )}
                </View>
            }
        </React.Fragment>
    );
}

export default React.memo(AudioDescription);