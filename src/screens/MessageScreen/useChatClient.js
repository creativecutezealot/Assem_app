import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY } from '../../helpers/config';

import { getObjInfo } from '../../helpers/utils';

export const useChatClient = () => {
    const [chatClient, setChatClient] = useState(
        StreamChat.getInstance(STREAM_API_KEY)
    );
    const [isConnecting, setIsConnecting] = useState(true);

    const loginUser = async (config, callback) => {
        try {
            const client = StreamChat.getInstance(STREAM_API_KEY);
            const user = {
                id: config.userId,
                image: config.userImage,
                name: config.userName,
            };
            await client.disconnectUser();
            const userToken = client.devToken(config.userId);
            await client.connectUser(user, userToken);
            setChatClient(client);
            callback(client);
        } catch (error) {
            console.warn('Here: ', error);
        }
    };

    const switchUser = async user => {
        setIsConnecting(true);
        try {
            if (user) {
                const fullName = user.first_name + ' ' + user.last_name;
                await loginUser({
                    userId: user.user_id,
                    userImage: user.photo_url,
                    userName: fullName,
                });
            } else {
                const config = await getObjInfo('@stream-rn-login-config');
                if (config) {
                    await loginUser(config);
                }
            }
        } catch (e) {
            console.warn(e);
        }

        setIsConnecting(false);
    };

    const logout = () => {
        // setChatClient(null);
        chatClient?.disconnectUser();
        // removeObjInfo('@stream-rn-login-config');
    };

    useEffect(() => {
        switchUser();
    }, []);

    return {
        chatClient,
        isConnecting,
        loginUser,
        logout,
        switchUser,
    };
};
