import React, { useContext, useMemo, useState, useRef } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';


import {
    ChannelList,
    ChannelListMessenger,
    Chat,
    Search,
    CircleClose,
    useChannelsContext,
} from 'stream-chat-react-native';
import styles from './styles';
import MessageContext from '../MessageScreen/context';
import Navigation from '../../routers/navigation';
import {
    EmptyContent,
} from '../../components/index';

import { useChatClient } from '../MessageScreen/useChatClient';
import Background from '../../components/container/background';

import constants from '../../styles/const';

import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

const sort = { last_message_at: -1 };
const colors = ['#131118', '#1f1b29', '#131118'];

const theme = {
    channelListMessenger: {
        flatList: {
            backgroundColor: constants.colors.background,
        },
        flatListContent: {
            backgroundColor: constants.colors.background,
        },
    },
    channelPreview: {
        container: {
            backgroundColor: constants.colors.background,
            borderBottomColor: '#151820',
        },
        title: {
            color: 'white',
        },
    },
    loadingIndicator: {
        container: {
            backgroundColor: constants.colors.background,
        },
    },
};

const ListComponent = props => {
    const { channels, loadingChannels, refreshing } = useChannelsContext();
    if (channels.length < 1 && !loadingChannels && !refreshing) {
        const description =
            'You have no messages right now. Try sending a message to another Club Member to get a conversation started!';
        return (
            <EmptyContent
                sortType={'voicenotes'}
                iconName={'users'}
                description={description}
                contentStyle={{ flexDirection: 'row' }}
                onPress={handleEmptyPress}
            />
        );
    }
    return <ChannelListMessenger {...props} />;
};

const handleEmptyPress = () => {
    Navigation.navigate('UserSelectorScreen');
};

const ChannelListScreen = props => {
    const { loginUser, logout, switchUser } = useChatClient();
    const { chatClient } = useContext(MessageContext);

    const searchInputRef = useRef(null);
    const [searchInputText, setSearchInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [channels, setChannels] = useState([]);
    let mid_channels = [];

    const memoizedFilters = useMemo(
        () => ({
            type: 'messaging',
            members: {
                $in: [chatClient?.user?.id],
            },
        }),
        [chatClient]
    );
    const [filter, setFilter] = useState(memoizedFilters);

    const newMessage = () => {
        Navigation.navigate('UserSelectorScreen');
    };

    const onSubmitEditing = async ({ nativeEvent: { text } }) => {
        const filter = {
            type: 'messaging',
            members: {
                $in: [chatClient?.user?.id],
            },
        };
        const channels = await chatClient.queryChannels(filter, sort);
        if (channels.length < 1) {
            const description =
                'You have no messages right now. Try sending a message to another Club Member to get a conversation started!';
            return;
        }
        let filtered = [];
        for (let i = 0; i < channels.length; i++) {
            const members = Object.values(
                channels[i].state?.members || {}
            ).filter(member => member.user?.id !== chatClient.user?.id);
            // const filtered = members.filter((member) => member.user?.name.includes(text));
            filtered = [
                ...filtered,
                ...members.filter(member => member.user?.name.includes(text)),
            ];
        }
        const ids = filtered.map(item => item.user.id);
        const memoizedFilters = {
            type: 'messaging',
            $and: [
                {
                    members: {
                        $in: [chatClient?.user?.id],
                    },
                },
                {
                    members: {
                        $in: ids,
                    },
                },
            ],
        };
        setFilter(memoizedFilters);
    };

    if (!chatClient?.user) return null;

    const CustomAvatar = ({ channel }) => {            
        if (mid_channels.filter(item => item.cid === channel.cid).length === 0) {
            mid_channels.push(channel);
        }
        setChannels(mid_channels);
        const memberIds = Object.keys(channel.state.members);
        const otherUserId = memberIds[0] === chatClient?.user.id
                ? memberIds[1]
                : memberIds[0];
        return (
            <Image
                source={{ uri: channel.state.members[otherUserId].user.image }}
                style={styles.channelAvatar}
            />
        );
    };

    const onNewMessage = () => {
        Navigation.navigate('UserSelectorScreen');
    };

    const onRemoveChannels = () => {
        Navigation.navigate('DeleteChannelListScreen', { channels: channels });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Background colors={colors} />
            <Chat client={chatClient} style={theme}>
                <View style={styles.absoluteFill}>
                    <View style={styles.channelHeader}>
                        <View
                            style={[
                                styles.searchContainer,
                                {
                                    backgroundColor:
                                        constants.colors.background,
                                    borderColor: 'grey_whisper',
                                },
                            ]}
                        >
                            <Search pathFill={'white'} />
                            <TextInput
                                onChangeText={text => {
                                    setSearchInputText(text);
                                    if (!text) {
                                        // reset();
                                        setSearchQuery('');
                                    }
                                }}
                                onSubmitEditing={onSubmitEditing}
                                placeholder="Search"
                                placeholderTextColor={'grey'}
                                ref={searchInputRef}
                                returnKeyType="search"
                                style={[styles.searchInput, { color: 'white' }]}
                                value={searchInputText}
                            />
                            {!!searchInputText && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSearchInputText('');
                                        setSearchQuery('');
                                        if (searchInputRef.current) {
                                            searchInputRef.current.blur();
                                        }
                                        // reset();
                                        setFilter(memoizedFilters);
                                    }}
                                >
                                    <CircleClose pathFill={'grey'} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => onNewMessage()}>
                            <View style={styles.iconContainer}>
                                <FontAwesome5Pro
                                    name={'edit'}
                                    style={styles.icon}
                                />
                            </View>
                        </TouchableOpacity>
                        { 
                            channels[0] && <TouchableOpacity onPress={() => onRemoveChannels()}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome5Pro
                                        name={'trash-alt'}
                                        style={styles.icon}
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    <ChannelList
                        List={ListComponent}
                        filters={filter}
                        maxUnreadCount={99}
                        options={{
                            watch: true,
                        }}
                        onSelect={channel => {
                            Navigation.navigate('ChannelScreen', {
                                channel: channel,
                            });
                        }}
                        sort={sort}
                        PreviewAvatar={CustomAvatar}
                    />

                    {/* <NewMessage
                        sortType={'voicenotes'}
                        iconName={'edit'}
                        description={'NEW MESSAGE'}
                        contentStyle={{ flexDirection: 'row' }}
                        onPress={newMessage} /> */}
                </View>
            </Chat>
        </SafeAreaView>
    );
};

export default ChannelListScreen;
