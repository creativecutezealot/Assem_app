import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import ChannelListScreen from '../ChannelListScreen';
import MessageContext from './context';
import { useChatClient } from './useChatClient';

const MessageScreen = props => {
    const { club } = props;
    const { loginUser, logout, switchUser } = useChatClient();
    const [loading, setLoading] = useState(false);
    const [chatClient, setChatClient] = useState(null);
    const appState = useRef(AppState.currentState);

    const initialize = async club => {
        setLoading(true);
        try {
            const user = {
                userId: global.currentUser.user_id + '-' + club.club_id,
                userImage: global.currentUser.photo_url,
                userName:
                    global.currentUser.first_name +
                    ' ' +
                    global.currentUser.last_name,
            };
            await loginUser(user, client => {
                setChatClient(client);
            });
        } catch (error) {
            console.warn('initiaization: ', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (club) {
            initialize(club);
        }
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, [club]);

    const _handleAppStateChange = async nextAppState => {
        if (appState.current.match(/background/) && nextAppState === 'active') {
            console.warn('App has come to the foreground!', club);
            if (club) {
                initialize(club);
            }
        }

        appState.current = nextAppState;
    };

    return (
        <MessageContext.Provider
            value={{ chatClient, loginUser, logout, switchUser }}
        >
            {!loading && chatClient && <ChannelListScreen />}
        </MessageContext.Provider>
    );
};

const mapStateToProps = state => {
    const club = state.currentClub.data;
    return {
        club,
    };
};

export default connect(mapStateToProps)(MessageScreen);
