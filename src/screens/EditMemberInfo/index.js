import React from 'react';
import {
    View,
    Text,
    TextInput,
    Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import constants from '../../styles/const';
import styles from './styles';
import {
    Container,
    MainButton,
    TakePhoto,
    SanityModal,
} from '../../components/index';

import {
    getDisplayName,
    isEmail,
    setObjInfo,
    showFlashMsg,
} from '../../helpers/utils';
import constVal from '../../helpers/constant';
import { ratioUser } from '../../helpers/config';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';
import NavigationService from '../../routers/navigation';

const ENDPOINTS = APIConfig.apiEndpoints;

const errorBio = 'Please tell us more about yourself by entering a short bio';
const errorJob =
    'Please tell us more about yourself by entering your most Recent Job Title';
const errorCompany =
    'Please tell us more about yourself by entering your most Recent Company';
const errorIndustry =
    'Please tell us more about yourself by entering the Industry you work in';
const errorEmail =
    'Hmm, that doesn’t look like a valid email address. Enter your email address in the format yourname@example.com';
const errorPhoto = 'Please upload a profile picture';
const errorPhoneMsg =
    'Hmm, the phone number looks incorrect. Please enter a valid phone number';
const errorFirstName =
    'Hmm, that does not look like a valid First Name. Please re-enter';
const errorLastName =
    'Hmm, that does not look like a valid Last Name. Please re-enter.';

const require_keys = {
    first_name: errorFirstName,
    last_name: errorLastName,
    email: errorEmail,
    photo_url: errorPhoto,
    short_bio: errorBio,
    job: errorJob,
    company: errorCompany,
};

const all_keys = [
    'first_name',
    'last_name',
    'email',
    'photo_url',
    'short_bio',
    'job',
    'industry',
    'company',
    'web_site',
    'linkedin_url',
    'twitter_url',
];

class EditMemberInfo extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            photo_url: '',
            short_bio: '',
            job: '',
            industry: '',
            company: '',
            web_site: '',
            linkedin_url: '',
            twitter_url: '',
            clubs: [],
            isEditing: false,
            loading: false,
            inputHeight: 56,
            showError: false,
            errMsg: '',
        };
    }

    async componentDidMount() {
        const id = global.currentUser.user_id;
        this.setState({
            loading: true,
        });
        await this.getUser();
        await this.getClubs();
        this.setState({
            loading: false,
        });
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    getUser = async () => {
        const id = global.currentUser.user_id;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getUser(id),
            });
            if (data.status) {
                this.setState({
                    first_name: data.data.first_name,
                    last_name: data.data.last_name,
                    username: getDisplayName(
                        data.data.first_name + data.data.last_name
                    ),
                    email: data.data.email,
                    photo_url: data.data.photo_url,
                    short_bio: data.data.short_bio,
                    job: data.data.job,
                    industry: data.data.industry,
                    company: data.data.company,
                    web_site: data.data.web_site,
                    linkedin_url: data.data.linkedin_url,
                    twitter_url: data.data.twitter_url,
                });
            }
        } catch (error) {
            showFlashMsg('Failed to load user info. Please try again', true);
        }
    };

    getClubs = async () => {
        const id = global.currentUser.user_id;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getClubsByUserId(id),
            });
            if (data.status) {
                this.setState({
                    clubs: data.connect,
                });
            }
        } catch (error) {
            showFlashMsg('Failed to load clubs. Please try again', true);
        }
    };

    externalOpenLink = uri => {
        const redirectUrl = uri.includes('http') ? uri : `https://${uri}`;
        try {
            Linking.canOpenURL(redirectUrl).then(supported => {
                if (!supported) {
                    // eslint-disable-next-line no-alert
                    global.alert('Can`t not open this link.');
                } else {
                    Linking.openURL(redirectUrl);
                }
            });
        } catch (error) {
            console.log('@@@@@ ' + error);
        }
    };

    onChangeURI = photo_url => {
        console.log({ photo_url });
        this.setState({
            photo_url,
        });
    };

    onChangeValue = (key, value) => {
        this.setState({
            [key]: value,
        });
    };

    onUpdateUser = async () => {
        const keys = Object.keys(require_keys);
        for (const index in keys) {
            if (!this.state[keys[index]] || this.state[keys[index]] === '') {
                this.handleModal(require_keys[keys[index]]);
                return;
            }
            if (keys[index] == 'email') {
                if (!isEmail(this.state[keys[index]].trim())) {
                    this.handleModal(require_keys[keys[index]]);
                    return;
                }
            }
        }
        const updateObj = {};
        all_keys.forEach(a => {
            updateObj[a] = this.state[a];
        });
        this.setState({
            loading: true,
        });
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData(updateObj),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                global.currentUser = data.data;
                await setObjInfo(constVal.USER_KEY, data.data);
                NavigationService.back();
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to update user info. Please try again', true);
        }
    };

    render() {
        const {
            first_name,
            last_name,
            username,
            email,
            photo_url,
            short_bio,
            job,
            industry,
            company,
            web_site,
            linkedin_url,
            twitter_url,
            clubs,
            loading,
            inputHeight,
            showError,
            errMsg,
        } = this.state;
        const id = global.currentUser.user_id;
        console.log('@@@@@ ' + this.state);
        return (
            <Container
                title="EDIT PROFILE"
                scrollEnabled={true}
                contentNonScroll={false}
                isHome={true}
            >
                <SanityModal
                    show={showError}
                    msg={errMsg}
                    onCancel={() => {
                        this.handleModal();
                    }}
                    onConfirm={() => {
                        this.handleModal();
                    }}
                />
                <View style={styles.memberContainer}>
                    <View style={styles.photoContainer}>
                        <TakePhoto
                            photoURL={photo_url}
                            onChangeURI={this.onChangeURI}
                            defaultW={120}
                            defaultH={120}
                            ratio={ratioUser}
                            style={{ borderRadius: 6 }}
                        />
                        <Text
                            style={[
                                styles.roleDes,
                                { color: constants.colors.primary_blue },
                            ]}
                        >
                            Change photo
                        </Text>
                    </View>

                    <View style={styles.detailContainer}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text style={styles.role}>First Name</Text>
                            <TextInput
                                value={first_name}
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                onChangeText={text =>
                                    this.onChangeValue('first_name', text)
                                }
                                placeholder={'FIRST NAME'}
                                style={styles.roleEdit}
                                maxLength={20}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>Last Name</Text>
                            <TextInput
                                value={last_name}
                                style={styles.roleEdit}
                                onChangeText={text =>
                                    this.onChangeValue('last_name', text)
                                }
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                placeholder={'LAST NAME'}
                                maxLength={20}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>Email</Text>
                            <TextInput
                                value={email}
                                style={styles.roleEdit}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={text =>
                                    this.onChangeValue('email', text)
                                }
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                placeholder={'Email'}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>User Name</Text>
                            <Text style={[styles.roleDes, { marginLeft: 20 }]}>
                                {getDisplayName(first_name + last_name)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={styles.role}>Bio</Text>
                            <TextInput
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                value={short_bio}
                                style={[
                                    styles.roleEdit,
                                    {
                                        height: Math.max(56, inputHeight),
                                        paddingVertical: 10,
                                    },
                                ]}
                                multiline={true}
                                maxLength={500}
                                onChangeText={text =>
                                    this.onChangeValue('short_bio', text)
                                }
                                placeholder={'BIO'}
                                onContentSizeChange={e => {
                                    this.setState({
                                        inputHeight:
                                            e.nativeEvent.contentSize.height +
                                            30,
                                    });
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text style={styles.role}>Job</Text>
                            <TextInput
                                onChangeText={text =>
                                    this.onChangeValue('job', text)
                                }
                                value={job}
                                style={styles.roleEdit}
                                maxLength={50}
                            />
                        </View>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={styles.role}>Industry</Text>
                            <TextInput
                                onChangeText={text => this.onChangeValue("industry", text)}
                                value={industry}
                                style={styles.roleEdit}>
                            </TextInput>
                        </View> */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>Company</Text>
                            <TextInput
                                onChangeText={text =>
                                    this.onChangeValue('company', text)
                                }
                                value={company}
                                style={styles.roleEdit}
                                maxLength={100}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text style={styles.role}>Website: </Text>
                            <TextInput
                                value={web_site}
                                keyboardType="url"
                                autoCapitalize="none"
                                onChangeText={text =>
                                    this.onChangeValue('web_site', text)
                                }
                                style={[
                                    styles.roleEdit,
                                    {
                                        textDecorationLine: 'underline',
                                        color: constants.colors.primary_blue,
                                    },
                                ]}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>Twitter: </Text>
                            <TextInput
                                value={twitter_url}
                                keyboardType="url"
                                autoCapitalize="none"
                                onChangeText={text =>
                                    this.onChangeValue('twitter_url', text)
                                }
                                style={[
                                    styles.roleEdit,
                                    {
                                        textDecorationLine: 'underline',
                                        color: constants.colors.primary_blue,
                                    },
                                ]}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={styles.role}>LinkedIn: </Text>
                            <TextInput
                                value={linkedin_url}
                                keyboardType="url"
                                autoCapitalize="none"
                                onChangeText={text =>
                                    this.onChangeValue('linkedin_url', text)
                                }
                                style={[
                                    styles.roleEdit,
                                    {
                                        textDecorationLine: 'underline',
                                        color: constants.colors.primary_blue,
                                    },
                                ]}
                            />
                        </View>

                        {clubs && clubs.length > 0 && (
                            <>
                                <Text
                                    style={[styles.roleDes, { marginTop: 20 }]}
                                >
                                    Member:
                                </Text>
                                {clubs.map((club, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.roleDes,
                                            { marginTop: 4, marginLeft: 20 },
                                        ]}
                                    >
                                        {getDisplayName(club.club_name, '#')}
                                    </Text>
                                ))}
                            </>
                        )}
                        <MainButton
                            label={'SAVE'}
                            styleWrapper={[
                                styles.btnWrapper,
                                { marginTop: 30 },
                            ]}
                            onPress={this.onUpdateUser}
                        />
                    </View>
                </View>
                <Spinner visible={loading} />
            </Container>
        );
    }
}
export default EditMemberInfo;
