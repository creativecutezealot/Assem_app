import React from 'react';
import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY } from '../../helpers/config';

const MessageContext = React.createContext({
    // channel: '',
    // setChannel: () => { },
    chatClient: StreamChat.getInstance(STREAM_API_KEY),
    loginUser: () => { },
    logout: () => { },
    // setClient: () => { },
    switchUser: () => { },
});

export default MessageContext;
