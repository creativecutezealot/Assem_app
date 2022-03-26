import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    FlatList,
    Text,
    Dimensions,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { request as connectUserRequest } from '../../actions/user/connectUser';
import { request as delConnectUserRequest } from '../../actions/user/delConnectUser';

import styles from './styles';
import ChatCard from '../../components/cards/ChatCard';
import { Container } from '../../components/index';
import { getDisplayName, showFlashMsg } from '../../helpers/utils';

const { width, height } = Dimensions.get('window');
import { normailzeQSData } from '../../saga/normalize';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';


import MessageContext from '../MessageScreen/context';
import { NoFragmentCyclesRule } from 'graphql';
import { useChatClient } from '../MessageScreen/useChatClient';
const ENDPOINTS = APIConfig.apiEndpoints;

const UserSelectorScreen = props => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState([]);
    const [selected, setSelected] = useState([]);

    const { chatClient } = useContext(MessageContext);
    const { isConnecting, loginUser, logout, switchUser } = useChatClient();

    useEffect(() => {
        setLoading(true);
        fetchInfos();
    }, []);

    const fetchInfos = () => {
        getUsersByClubId();
        getConnectsByUserId();
        getManagersByClubId();
    };

    const getUsersByClubId = async () => {
        try {
            const { club } = props;
            if (club) {
                const { data } = await axiosAjax({
                    method: 'get',
                    url: ENDPOINTS.getUsersByClubId(club.club_id),
                });
                if (data && data.status) {
                    if (data.connect && data.connect.length > 0) {
                        const currentUserId = global.currentUser.user_id;
                        const newusers = data.connect.filter(
                            user => user.user_role !== 'admin'
                        );
                        setUsers(
                            data.connect.filter(
                                user => user.user_id !== currentUserId
                            )
                        );
                    }
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load users. Please try again', true);
        }
    };

    const getManagersByClubId = async () => {
        try {
            const { club } = props;
            if (club) {
                const { data } = await axiosAjax({
                    method: 'get',
                    url: ENDPOINTS.getClubManagers(club.club_id),
                });
                if (data && data.status) {
                    if (data.data && data.data.length > 0) {
                        const currentUserId = global.currentUser.user_id;
                        const managers = data.data.filter(
                            user => user.user_role !== 'admin'
                        );
                        setManagers(managers);
                    }
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load managers. Please try again', true);
        }
    };

    const goVoiceNote = async item => {
        if (chatClient && !chatClient.user.id) return;
        if (!item.user_id) return;
        if (!club.club_id) return;
        const userId = item.user_id + '-' + club.club_id;
        const members = [chatClient.user.id, userId];
        const channels = await chatClient.queryChannels({
            distinct: true,
            members,
        });
        let currentChannel;
        if (channels.length === 1) {
            currentChannel = channels[0];
        } else {
            const channel = chatClient.channel('messaging', {
                members,
            });
            // channel.initialized = true;
            currentChannel = channel;
        }
        props.navigation.navigate('ChannelScreen', { channel: currentChannel });
    };

    const getConnectsByUserId = async () => {
        try {
            const { club } = props;
            if (!club) {
                return;
            }
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectUsers(
                    global.currentUser.user_id,
                    club.club_id
                ),
            });
            setLoading(false);
            console.log('@@@@@ data', data);
            if (data.status) {
                if (data.connect && data.connect.length > 0) {
                    console.log('@@@@@ connected', data.connect);
                    initSelected(data.connect);
                }
            }
        } catch (error) {
            setLoading(false);
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load club users. Please try again', true);
        }
    };

    const initSelected = data => {
        var selected = [];
        for (const idx in data) {
            const user = data[idx];
            selected.push(user.user_id);
        }
        setSelected(selected);
    };

    const onFollowingBack = async (opposite_id, club_id) => {
        setLoading(true);
        try {
            const { data } = await axiosAjax({
                method: 'DELETE',
                url: ENDPOINTS.delConnectUser(opposite_id, club_id),
            });
            setLoading(false);
            if (data.status) {
                setSelected(selected.filter(r => r !== opposite_id));
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const onFollowing = async (opposite_id, club_id) => {
        setLoading(true);
        try {
            const { data } = await axiosAjax({
                method: 'POST',
                url: ENDPOINTS.connectUser(),
                data: normailzeQSData({
                    opposite_id,
                    club_id,
                }),
            });
            setLoading(false);
            if (data.status) {
                setSelected([...selected, opposite_id]);
            }
        } catch (error) {
            setLoading(NoFragmentCyclesRule);
        }
    };

    const disabledItem = item => {
        const itemIndex = selected.findIndex(r => r === item.user_id);
        return itemIndex >= 0;
    };

    const _renderItem = ({ item, index }) => {
        const disabled = disabledItem(item);
        return (
            <ChatCard
                item={item}
                disabled={disabled}
                showVoiceBtn={true}
                onSendVoiceNote={() => goVoiceNote(item)}
            />
        );
    };

    const _sortByCreatedAt = (a, b) => {
        return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    };

    let sortedUsers = [];
    for (const user of users) {
        if (managers.find(a => a.sort_key.includes(user.user_id))) {
            user['is_manager'] = true;
        } else {
            user['is_manager'] = false;
        }
        sortedUsers.push(user);
    }
    const manager_users = sortedUsers
        .filter(user => user.is_manager)
        .sort(_sortByCreatedAt);
    const genral_users = sortedUsers
        .filter(user => !user.is_manager)
        .sort(_sortByCreatedAt);
    sortedUsers = [...manager_users, ...genral_users];
    const { club } = props;

    return (
        <Container title="NEW MESSAGE" isHome={true}>
            <NavigationEvents
                onDidFocus={payload => {
                    fetchInfos();
                }}
            />
            <Spinner visible={props.loading || loading} />
            <View style={styles.container}>
                <View style={styles.guideWrapper}>
                    <Text style={styles.guide}>
                        {getDisplayName(club?.club_name, '#')} Members
                    </Text>
                </View>
                <View style={styles.tableWrapper}>
                    <FlatList
                        numColumns={2}
                        style={{ width: '100%' }}
                        data={sortedUsers}
                        renderItem={_renderItem}
                        keyExtractor={item => item.user_id}
                    />
                </View>
            </View>
        </Container>
    );
};

const mapStateToProps = state => {
    return {
        club: state.currentClub.data,
    };
};

const mapDispatchToProps = {
    connectUserRequest,
    delConnectUserRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSelectorScreen);
