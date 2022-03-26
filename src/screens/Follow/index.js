import React from 'react';
import {
    View,
    FlatList,
    Text,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import { request as connectUserRequest } from '../../actions/user/connectUser';
import { request as delConnectUserRequest } from '../../actions/user/delConnectUser';

import styles from './styles';
import ConnectCard from '../../components/cards/ConnectCard';
import { Container } from '../../components/index';
import { getDisplayName, showFlashMsg } from '../../helpers/utils';

const { width, height } = Dimensions.get('window');
import { normailzeQSData } from '../../saga/normalize';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
const ENDPOINTS = APIConfig.apiEndpoints;

class Follow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            managers: [],
            selected: [],
            loading: false,
            query: '',
            filtered: [],
        };
    }

    componentDidMount = () => {
        this.getSlectedUsers(global.currentUser.user_id);
        this.getManagersByClubId();
        const { id, following } = this.props.navigation.state.params;
        if (following) {
            this.getFollowingUsers(id);
        } else {
            this.getFollowerUsers(id);
        }
        setTimeout(() => {
            const { users, loading, managers } = this.state;
            const { id, following } = this.props.navigation.state.params;
            let sortedUsers = [];
            for (const user of users) {
                if (managers.find(a => a.sort_key.includes(user.user_id))) {
                    user['is_manager'] = true;
                } else {
                    user['is_manager'] = false;
                }
                sortedUsers.push(user);
            }
            console.log('@@@@@ sorted user', sortedUsers.length);
            const manager_users = sortedUsers
                .filter(user => user.is_manager)
                .sort(this._sortByCreatedAt);
            const general_users = sortedUsers
                .filter(user => !user.is_manager)
                .sort(this._sortByCreatedAt);
            sortedUsers = [...manager_users, ...general_users];
            this.setState({
                filtered: sortedUsers,
            });
        }, 1000);
    };

    getManagersByClubId = async () => {
        try {
            const { club } = this.props;
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
                        this.setState({ managers });
                    }
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load managers. Please try again', true);
        }
    };

    goVoiceNote = item => {
        this.props.navigation.navigate('VoiceNoteModal', { id: item.user_id });
    };

    getFollowingUsers = async userId => {
        try {
            const { club } = this.props;
            if (!club) {
                return;
            }
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectUsers(userId, club.club_id),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                if (data.connect && data.connect.length > 0) {
                    console.log('@@@@@ followings', data.connect);
                    this.setState({
                        users: data.connect,
                    });
                }
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load club users. Please try again', true);
        }
    };

    getSlectedUsers = async userId => {
        try {
            const { club } = this.props;
            if (!club) {
                return;
            }
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectUsers(userId, club.club_id),
            });
            if (data.status) {
                if (data.connect && data.connect.length > 0) {
                    this.initSelected(data.connect);
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load club users. Please try again', true);
        }
    };

    getFollowerUsers = async () => {
        const { id } = this.props.navigation.state.params;
        const { club } = this.props;
        if (!club) {
            return;
        }
        this.setState({
            loading: true,
        });
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectFollowUsers(id, club.club_id),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                console.log('@@@@@ followers', data.connect.length);
                this.setState({
                    users: data.connect,
                });
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            showFlashMsg(
                'Failed to load users for this club. Please try again',
                true
            );
        }
    };

    initSelected = data => {
        var selected = [];
        for (const idx in data) {
            const user = data[idx];
            selected.push(user.user_id);
        }
        this.setState({
            selected,
        });
    };

    onPressItem = item => {
        const { club } = this.props;
        if (!club) {
            return;
        }
        const disabled = this.disabledItem(item);
        if (disabled) {
            this.onFollowingBack(item.user_id, club.club_id);
        } else {
            this.onFollowing(item.user_id, club.club_id);
        }
    };

    onFollowingBack = async (opposite_id, club_id) => {
        this.setState({
            loading: true,
        });
        try {
            const { data } = await axiosAjax({
                method: 'DELETE',
                url: ENDPOINTS.delConnectUser(opposite_id, club_id),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                this.setState({
                    selected: this.state.selected.filter(
                        r => r !== opposite_id
                    ),
                });
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
        }
    };

    onFollowing = async (opposite_id, club_id) => {
        this.setState({
            loading: true,
        });
        try {
            const { data } = await axiosAjax({
                method: 'POST',
                url: ENDPOINTS.connectUser(),
                data: normailzeQSData({
                    opposite_id,
                    club_id,
                }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                this.setState({
                    selected: [...this.state.selected, opposite_id],
                });
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
        }
    };

    disabledItem = item => {
        const itemIndex = this.state.selected.findIndex(
            r => r === item.user_id
        );
        return itemIndex >= 0;
    };

    handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const { users, loading, managers } = this.state;
        const { id, following } = this.props.navigation.state.params;
        let sortedUsers = [];
        for (const user of users) {
            if (managers.find(a => a.sort_key.includes(user.user_id))) {
                user['is_manager'] = true;
            } else {
                user['is_manager'] = false;
            }
            sortedUsers.push(user);
        }
        console.log('@@@@@ sorted user', sortedUsers.length);
        const manager_users = sortedUsers
            .filter(user => user.is_manager)
            .sort(this._sortByCreatedAt);
        const general_users = sortedUsers
            .filter(user => !user.is_manager)
            .sort(this._sortByCreatedAt);
        sortedUsers = [...manager_users, ...general_users];
        const filtered = sortedUsers.filter(
            user => user.username && user.username.includes(formattedQuery)
        );
        this.setState({
            query: text,
            filtered: filtered,
        });
    };

    _renderSearchBar = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    padding: 10,
                    marginVertical: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'gray',
                }}
            >
                <TouchableOpacity
                    style={styles.logoIcon}
                    onPress={() => this.handleSearch(this.state.query)}
                >
                    <FontAwesome5Pro name="search" color={'white'} size={20} />
                </TouchableOpacity>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    value={this.state.query}
                    onChangeText={queryText => this.handleSearch(queryText)}
                    placeholder="Search"
                    placeholderTextColor={'white'}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        paddingHorizontal: 20,
                        color: 'white',
                    }}
                />
            </View>
        );
    };

    _renderItem = ({ item, index }) => {
        const disabled = this.disabledItem(item);
        return (
            <ConnectCard
                item={item}
                disabled={disabled}
                onPress={() => this.onPressItem(item)}
                showVoiceBtn={true}
                onSendVoiceNote={() => this.goVoiceNote(item)}
            />
        );
    };

    _sortByCreatedAt = (a, b) => {
        return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    };

    render() {
        const { users, loading, managers, filtered } = this.state;
        const { id, following } = this.props.navigation.state.params;
        const { club } = this.props;
        return (
            <Container
                title={following ? 'Following' : 'Followers'}
                isHome={true}
            >
                <NavigationEvents
                    onDidFocus={payload => {
                        this.getSlectedUsers(global.currentUser.user_id);
                        this.getManagersByClubId();
                        const {
                            id,
                            following,
                        } = this.props.navigation.state.params;
                        if (following) {
                            this.getFollowingUsers(id);
                        } else {
                            this.getFollowerUsers(id);
                        }
                    }}
                />
                <Spinner visible={loading} />
                <View style={styles.container}>
                    <View style={styles.guideWrapper}>
                        <Text style={styles.guide}>
                            {getDisplayName(club?.club_name, '#')} Members
                        </Text>
                    </View>
                    <View style={styles.tableWrapper}>
                        <FlatList
                            ListHeaderComponent={this._renderSearchBar}
                            numColumns={2}
                            style={{ width: '100%' }}
                            data={filtered}
                            extraData={this.state}
                            renderItem={this._renderItem}
                            keyExtractor={item => item.user_id}
                        />
                    </View>
                </View>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    club: state.currentClub.data,
});

const mapDispatchToProps = {
    connectUserRequest,
    delConnectUserRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Follow);
