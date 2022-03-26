import React from 'react';
import { View, Text, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import {
    Container,
    TakePhoto,
    MainButton,
    SanityModal,
} from '../../components/index';
import { isFullName, showFlashMsg } from '../../helpers/utils';
import { ratioUser } from '../../helpers/config';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;

const errorPhoto = 'Please upload a profile picture';

class EnterPhoto extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            loading: false,
            showError: false,
            errMsg: '',
        };
    }

    componentDidMount() {
        Keyboard.dismiss();
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangeURI = photo => {
        this.setState({ photo });
    };

    onUpdate = () => {
        const { photo } = this.state;
        if (!isFullName(photo)) {
            this.handleModal(errorPhoto);
            return;
        }

        Keyboard.dismiss();
        this.setState({
            loading: true,
        });
        this.update();
    };

    update = async () => {
        const { photo } = this.state;
        const user = global.currentUser;
        try {
            /// update photo and approve user
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({ photo_url: photo, approved: true }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                global.currentUser = data.data;
                this.goNext();
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to update user photo. Please try again', true);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('Tutorial');
    };

    render() {
        const { loading, showError, errMsg } = this.state;
        return (
            <Container>
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
                <Spinner visible={loading} />
                <View style={styles.container}>
                    <View style={styles.guideWrapper}>
                        <Text style={styles.guide}>ADD A PHOTO</Text>
                        <Text style={styles.guideDes}>
                            {'Adding a photo helps Members\nrecognize you'}
                        </Text>
                    </View>
                    <TakePhoto
                        onChangeURI={this.onChangeURI}
                        ratio={ratioUser}
                    />
                    <MainButton
                        onPress={() => this.onUpdate()}
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterPhoto;
