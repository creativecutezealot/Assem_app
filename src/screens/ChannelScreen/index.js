import React, {
    useEffect,
    useState,
    useContext,
    useRef,
} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StatusBar,
    Platform,
    AppState,
} from 'react-native';
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    OverlayProvider,
    Thread,
    KeyboardCompatibleView
} from 'stream-chat-react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from './styles';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import MessageContext from '../MessageScreen/context';
import { connect } from 'react-redux';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import constants from '../../styles/const';
import Background from '../../components/container/background';
import Navigation from '../../routers/navigation';
import {
    showFlashMsg,
} from '../../helpers/utils';
const ENDPOINTS = APIConfig.apiEndpoints;

const CustomKeyboardCompatibleView = ({ children }) => {
    const insets = useSafeAreaInsets();

    return children;

    if (Platform.OS === 'android') {
        return children;
    }

    const iosVerticalOffset = insets.bottom > 0 ? 60 : 0;

    return (
        <KeyboardCompatibleView
            keyboardVerticalOffset={iosVerticalOffset}>
            {children}
        </KeyboardCompatibleView>
    );
};

const ChannelNavigator = createStackNavigator(
    {
        Channel: {
            screen: (props) => <Channel1 {...props} club={props.screenProps.club} />,
            navigationOptions: ({ navigation }) => ({
                headerShown: false,
            }),
        },
        Thread: {
            screen: (props) => <ThreadScreen {...props} />,
            navigationOptions: ({ navigation }) => ({
                headerShown: false,
            }),
        },
    },
    {
        initialRouteName: 'Channel',
    }
);

const ChannelContext = React.createContext();

const ChannelContainer = createAppContainer(ChannelNavigator);

const Channel1 = props => {
    const { chatClient } = useContext(MessageContext);
    const { channel, thread, setThread } = useContext(ChannelContext);
    const [title, setTitle] = useState('');
    const [lastActive, setLastActive] = useState('');
    const backgroundColor = constants.colors.background;
    const colors = ['#131118', '#1f1b29', '#131118'];

    const appState = useRef(AppState.currentState);

    const goBack = () => {
        Navigation.back();
    };

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        if (channel) {
            const members = Object.values(channel.state?.members || {}).filter(
                member => member.user?.id !== chatClient.user?.id
            );
            const memberName = members
                .map(
                    member =>
                        member.user?.name || member.user?.id || 'Unnamed User'
                )
                .join(', ');
            setTitle(memberName);
            members.map(member => {
                const last_active = new Date(member.user?.last_active);
                const current_time = new Date();

                const diffSeconds = Math.abs(current_time - last_active) / 1000;
                const diffMins = Math.ceil(diffSeconds / 60);
                const diffHours = Math.ceil(diffSeconds / (60 * 60));
                const diffDays = Math.ceil(diffSeconds / (60 * 60 * 24));

                if (diffSeconds === 0) {
                    setLastActive('Active');
                } else if (diffMins < 60) {
                    setLastActive(`Seen ${diffMins} minutes ago`);
                } else if (diffHours < 24) {
                    setLastActive(`Seen ${diffHours} hours ago`);
                } else {
                    setLastActive(`Seen ${diffDays} days ago`);
                }
            });
        } else {
            goBack();
        }
    }, [channel]);

    const _handleAppStateChange = async nextAppState => {
        if (appState.current.match(/background/) && nextAppState === 'active') { }
        await goBack();
        appState.current = nextAppState;
    };

    const handleLogoClick = async () => {
      const memberIds = Object.keys(channel.state.members);
      const otherUserId = memberIds[0] === chatClient.user.id ? memberIds[1] : memberIds[0];

      try {
          const { club } = props;
          if (club) {
            const userId = otherUserId.replace(club.club_id, '').slice(0, -1);

            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getUser(userId),
            });

            if (data.status) {
                Navigation.navigate('MemberInfoModal', {
                    user: data.data,
                    hideVoiceNote: true,
                });              
            }
          }
      } catch (error) {
          console.log('@@@@@ ' + error);
          showFlashMsg('Failed to load user info. Please try again', true);
      }
    };

    if (!channel || !chatClient) return null;

    const CustomAvatar = props => {
        const memberIds = Object.keys(props.channel.state.members);
        const otherUserId =
            memberIds[0] === chatClient.user.id
                ? memberIds[1]
                : memberIds[0];
        return (
            <Image
                source={{
                    uri: props.channel.state.members[otherUserId].user.image,
                }}
                style={styles.channelAvatar}
            />
        );
    };

    return (
        <Channel
            channel={channel}
            thread={thread}
            disableTypingIndicator
            enforceUniqueReaction
            initialScrollToFirstUnreadMessage
            KeyboardCompatibleView={CustomKeyboardCompatibleView}
        >
            <View style={styles.absoluteFill}>
                <Background colors={colors} />
                <StatusBar
                    backgroundColor={backgroundColor}
                    barStyle={'light-content'}
                />

                <View style={styles.logoWrapper}>
                    <TouchableOpacity
                        style={styles.logoIcon}
                        onPress={goBack}
                    >
                        <FontAwesome5Pro
                            name="times"
                            color={'white'}
                            size={32}
                        />
                    </TouchableOpacity>

                    <View style={styles.mainHeaderContainer}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <Text style={styles.subTitle}>
                            {lastActive}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.logoIcon} onPress={() => handleLogoClick()}>
                        <CustomAvatar channel={channel} />
                    </TouchableOpacity>
                </View>
                <MessageList
                    onThreadSelect={(thread) => {
                        setThread(thread);
                        props.navigation.navigate('Thread', {
                            channelId: channel.id
                        });
                    }}
                    style={{ fontSize: 8 }}
                    // additionalFlatListProps={{
                    //     renderItem: ({item}) => {
                    //         console.log(item);
                    //         return (
                    //             <Text style={{fontSize: 8, color: 'white'}}>{'sdfdfd'}</Text>
                    //         )
                    //     }
                    // }}
                    
                />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <MessageInput />
                    </View>
                </View>
            </View>
        </Channel>
    );
};

const ThreadScreen = props => {
    const { chatClient } = useContext(MessageContext);
    const { channel, thread } = useContext(ChannelContext);
    const backgroundColor = constants.colors.background;
    const colors = ['#131118', '#1f1b29', '#131118'];
    const [sendMessageInChannel, setSendMessageInChannel] = useState(false);

    const truncate = (input, length, end = '...') => {
        if (input.length > length) {
            return `${input.substring(0, length - end.length)}${end}`;
        }
        return input;
    };

    const getChannelDisplayName = (
        channel,
        includeChannelPrefix = false,
        includeUserStatus = true,
    ) => {
        if (!channel) {
            return '#channel_name';
        }

        if (channel.name || (channel.data && channel.data.name)) {
            const name = channel.name || channel.data.name;
            return `${includeChannelPrefix ? '#' : ''} ${name
                .toLowerCase()
                .replace(' ', '_')}`;
        }

        if (!channel.state) {
            return 'Direct Messaging';
        }

        const otherMembers = Object.values(channel.state.members).filter(
            m => m.user.id !== chatClient.user.id,
        );

        if (otherMembers.length === 1) {
            return `${otherMembers[0].user.name}  ${includeUserStatus && otherMembers[0].user.status
                ? otherMembers[0].user.status
                : ''
                }`;
        }
        return otherMembers.map(m => m.user.name).join(', ');
    };

    const goBack = () => {
        props.navigation.goBack();
    };
    return (
        <Channel
            channel={channel}
            thread={thread}
            doSendMessageRequest={async (cid, message) => {
                const newMessage = {
                    ...message,
                    show_in_channel: sendMessageInChannel,
                    parentMessageText: sendMessageInChannel
                        ? thread.text
                        : undefined,
                };
                return channel.sendMessage(newMessage);
            }}
            // keyboardVerticalOffset={
            //     Platform.OS === 'ios' ? 0 : -300
            // }
            KeyboardCompatibleView={CustomKeyboardCompatibleView}
        >
            <View style={styles.absoluteFill}>
                <Background colors={colors} />
                <StatusBar
                    backgroundColor={backgroundColor}
                    barStyle={'light-content'}
                />
                <View style={styles.logoWrapper}>
                    <TouchableOpacity
                        style={styles.logoIcon}
                        onPress={goBack}
                    >
                        <FontAwesome5Pro
                            name="times"
                            color={'white'}
                            size={32}
                        />
                    </TouchableOpacity>
                    <View style={styles.mainHeaderContainer}>
                        <Text style={styles.title}>
                            {'Thread'}
                        </Text>
                        <Text style={styles.subTitle}>
                            {truncate(getChannelDisplayName(channel, true), 35)}
                        </Text>
                    </View>
                </View>
                <Thread thread={thread} />
            </View>
        </Channel>
    );
};

const ChannelScreen = props => {
    const { chatClient } = useContext(MessageContext);
    const { bottom } = useSafeAreaInsets();
    const backgroundColor = constants.colors.background;
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();

    const theme = {
        inlineDateSeparator: {
            text: {
                fontSize: 14,
            },
        },
        dateHeader: {
            text: {
                fontSize: 14,
            },
        },
        messageSimple: {
            content: {
                containerInner: {
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    color: '#FFFFFF',
                },
                markdown: {
                    text: {
                        color: 'white',
                        fontSize: 16,
                    },
                },
                metaText: {
                    fontSize: 14,
                },
            },
            card: {
                container: {
                    backgroundColor: 'white',
                },
            },
            replies: {
                messageRepliesText: {
                    fontSize: 14,
                },
            },
        },
        messageList: {
            container: {
                backgroundColor: backgroundColor,
            },
            inlineUnreadIndicator: {
                text: {
                    color: 'red',
                },
            },
        },
        messageInput: {
            container: {
                backgroundColor: backgroundColor,
            },
            inputBox: {
                color: 'white',
                fontSize: 16,
            },
        },
    };

    useEffect(() => {
        const channel_params = props.navigation.state.params.channel;
        if (channel_params) {
            const initChannel = async () => {
                try {
                    if (!chatClient) return;
                    if (!channel_params.initialized) {
                        await channel_params.watch();
                    }
                    setChannel(channel_params);
                } catch (error) {
                    console.warn(error.message);
                    showFlashMsg(
                        'The following users are specified in channel.members but don\'t exist. Please create the user objects before setting up the channel.',
                        true
                    );
                    // goBack();
                }
            };

            initChannel();
        } else {
            // goBack();
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ChannelContext.Provider value={{ channel, setChannel, thread, setThread }}>
                <OverlayProvider
                    bottomInset={bottom}
                    topInset={0}
                    value={{ style: theme }}
                >
                    <Chat client={chatClient}>
                        <ChannelContainer screenProps={{
                          club: props.club
                        }}/>
                    </Chat>
                </OverlayProvider>
            </ChannelContext.Provider>
        </SafeAreaView>
    );
};

const mapStateToProps = state => ({
  club: state.currentClub.data,
});

export default connect(mapStateToProps)(ChannelScreen);
