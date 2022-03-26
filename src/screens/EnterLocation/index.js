import React, { createRef } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from '../../components/googleautocomplete';

import styles from './styles';
import { isAddress, showFlashMsg } from '../../helpers/utils';

import { GOOGLE_API_KEY } from '../../helpers/config';
import { Container, MainButton, SanityModal } from '../../components/index';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;

const errorLocation =
    'Hmm, that does not look like a valid location. Please choose search for a valid location.';
const alertMsg =
    'We can’t find the location. Please select from matches below or enter a new search';

class EnterLocation extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            city: '',
            country: '',
            _state: '',
            loading: false,
            showError: false,
            errMsg: '',
            value: '',
        };
        this.googlePlaceRef = createRef();
    }

    componentDidMount() {
        this.getInitialState();
    }

    getInitialState = () => {
        Geocoder.init(GOOGLE_API_KEY);
        Geolocation.getCurrentPosition(
            position => {
                Geocoder.from(
                    position.coords.latitude,
                    position.coords.longitude
                )
                    .then(json => {
                        this.getFullCityAndCountry(
                            json.results[0].address_components
                        );
                        this.getFullAddress(json.results[0]);
                    })
                    .catch(error => console.warn(error));
            },
            error => {
                console.log('@@@@@ ' + error.code, error.message);
                // this.handleModal(alertMsg);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 100000,
            }
        );
    };

    getFullCityAndCountry = (addressComponent: Array) => {
        if (addressComponent && addressComponent.length > 0) {
            const city =
                addressComponent.filter(
                    x => x.types.filter(t => t == 'locality').length > 0
                )[0]?.short_name || '';
            const country =
                addressComponent.filter(
                    x => x.types.filter(t => t == 'country').length > 0
                )[0]?.long_name || '';
            const _state =
                addressComponent.filter(
                    x =>
                        x.types.filter(t => t == 'administrative_area_level_1')
                            .length > 0
                )[0]?.short_name || '';
            this.setState({
                city,
                country,
                _state,
                value: `${city}`,
            });
        }
    };

    getFullAddress = details => {
        const { formatted_address } = details;
        this.setState({
            address: formatted_address,
        });
        console.log('@@@@@ address', formatted_address);
        if (this.googlePlaceRef) {
            this.googlePlaceRef.setAddressText(formatted_address);
        }
    };

    onChangeText = address => {
        this.setState({
            value: address,
        });
    };

    handleAddress = address => {
        this.setState({
            address,
        });
        Geocoder.from(address)
            .then(json => {
                if (json.results.length > 0) {
                    this.getFullCityAndCountry(
                        json.results[0].address_components
                    );
                    this.getFullAddress(json.results[0]);
                }
            })
            .catch(error => console.warn(error));
    };

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onUpdateLocation = () => {
        const { address } = this.state;
        if (!isAddress(address)) {
            this.handleModal(errorLocation);
            return;
        }

        Keyboard.dismiss();
        this.setState({
            loading: true,
        });
        this.updateLocation();
    };

    updateLocation = async () => {
        const { address, city, country, _state } = this.state;
        const user = global.currentUser;
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({
                    address,
                    city,
                    country,
                    location_state: _state,
                }),
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
            showFlashMsg('Failed to update location. Please try again', true);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('EnterBirth');
    };

    render() {
        const {
            loading,
            showError,
            errMsg,
            city,
            country,
            _state,
            value,
        } = this.state;
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
                    <KeyboardAvoidingView>
                        <View style={styles.guideWrapper}>
                            <Text style={styles.guide}>WHAT IS</Text>
                            <Text style={styles.guide}>YOUR LOCATION?</Text>
                            <Text style={styles.guideDes}>
                                Tell us where you are located
                            </Text>
                        </View>
                        <GooglePlacesAutocomplete
                            ref={ref => (this.googlePlaceRef = ref)}
                            placeholder=""
                            onPress={(data, details = null) => {
                                if (data && data.description) {
                                    this.handleAddress(data.description);
                                }
                            }}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                            }}
                            textInputProps={{
                                value: value,
                                onChangeText: this.onChangeText,
                            }}
                            numberOfLines={3}
                            enablePoweredByContainer={false}
                            GooglePlacesDetailsQuery={{
                                fields: 'formatted_address',
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'country',
                                'administrative_area_level_1',
                                'administrative_area_level_2',
                                'administrative_area_level_3',
                            ]}
                        />
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                        onPress={() => this.onUpdateLocation()}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterLocation;
