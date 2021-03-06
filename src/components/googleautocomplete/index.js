import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import Qs from 'qs';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import constants from '../../styles/const';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';

const WINDOW = Dimensions.get('window');
const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.05;
const logoWidth = logoHeight * 5.46;
const defaultStyles = {
    container: {
        width: width * 0.8,
    },
    textInputContainer: {
        backgroundColor: 'transparent',
        marginTop: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        flex: 1,
        borderRadius: 6,
    },
    textInput: {
        backgroundColor: 'transparent',
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
        flex: 1,
        borderRadius: 6,
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    powered: {},
    listView: {
        flex: 1,
    },
    row: {
        padding: 13,
        height: 44,
        flexDirection: 'row',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    description: {
        fontFamily: constants.fonts.sweetSans,
        color: constants.colors.white,
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    clearIcon: {
        width: 24,
        height: 24,
        marginLeft: 5,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
};

export default class GooglePlacesAutocomplete extends Component {
    _isMounted = false;
    _results = [];
    _requests = [];

    constructor(props) {
        super(props);
        this.state = this.getInitialState.call(this);
    }

    getInitialState = () => ({
        text: this.props.getDefaultValue(),
        dataSource: this.buildRowsFromResults([]),
        listViewDisplayed:
            this.props.listViewDisplayed === 'auto'
                ? false
                : this.props.listViewDisplayed,
        url: this.getRequestUrl(this.props.requestUrl),
        inputHeight: 44,
    });

    getRequestUrl = requestUrl => {
        if (requestUrl) {
            if (requestUrl.useOnPlatform === 'all') {
                return requestUrl.url;
            }
            if (requestUrl.useOnPlatform === 'web') {
                return Platform.select({
                    web: requestUrl.url,
                    default: 'https://maps.googleapis.com/maps/api',
                });
            }
        } else {
            return 'https://maps.googleapis.com/maps/api';
        }
    };

    requestShouldUseWithCredentials = () =>
        this.state.url === 'https://maps.googleapis.com/maps/api';

    hasNavigator = () => {
        if (global.navigator && global.navigator.geolocation) {
            return true;
        } else {
            console.warn(
                'If you are using React Native v0.60.0+ you must follow these instructions to enable currentLocation: https://git.io/Jf4AR'
            );
            return false;
        }
    };

    setAddressText = address => this.setState({ text: address });

    getAddressText = () => this.state.text;

    buildRowsFromResults = results => {
        let res = [];

        if (
            results.length === 0 ||
            this.props.predefinedPlacesAlwaysVisible === true
        ) {
            res = [
                ...this.props.predefinedPlaces.filter(
                    place => place.description && place.description.length
                ),
            ];

            if (this.props.currentLocation === true && this.hasNavigator()) {
                res.unshift({
                    description: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        }

        res = res.map(place => ({
            ...place,
            isPredefinedPlace: true,
        }));

        return [...res, ...results];
    };

    UNSAFE_componentWillMount() {
        this._request = this.props.debounce
            ? debounce(this._request, this.props.debounce)
            : this._request;
    }

    componentDidMount() {
        // This will load the default value's search results after the view has
        // been rendered
        this._handleChangeText(this.state.text);
        this._isMounted = true;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.predefinedPlaces !== this.props.predefinedPlaces) {
            this.setState({
                dataSource: this.buildRowsFromResults(this._results),
            });
        }
    }

    componentWillUnmount() {
        this._abortRequests();
        this._isMounted = false;
    }

    _abortRequests = () => {
        this._requests.map(i => i.abort());
        this._requests = [];
    };

    supportedPlatform(from) {
        if (Platform.OS === 'web' && !this.props.requestUrl) {
            console.warn(
                'This library cannot be used for the web unless you specify the requestUrl prop. See https://git.io/JflFv for more for details.'
            );
            return false;
        } else {
            return true;
        }
    }

    /**
     * This method is exposed to parent components to focus on textInput manually.
     * @public
     */
    triggerFocus = () => {
        if (this.refs.textInput) this.refs.textInput.focus();
    };

    /**
     * This method is exposed to parent components to blur textInput manually.
     * @public
     */
    triggerBlur = () => {
        if (this.refs.textInput) this.refs.textInput.blur();
    };

    getCurrentLocation = () => {
        let options = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000,
        };

        if (
            this.props.enableHighAccuracyLocation &&
            Platform.OS === 'android'
        ) {
            options = {
                enableHighAccuracy: true,
                timeout: 20000,
            };
        }

        global.navigator.geolocation.getCurrentPosition(
            position => {
                if (this.props.nearbyPlacesAPI === 'None') {
                    let currentLocation = {
                        description: this.props.currentLocationLabel,
                        geometry: {
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            },
                        },
                    };

                    this._disableRowLoaders();
                    this.props.onPress(currentLocation, currentLocation);
                } else {
                    this._requestNearby(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                }
            },
            error => {
                this._disableRowLoaders();
                global.alert(error.message);
            },
            options
        );
    };

    _onPress = rowData => {
        if (
            rowData.isPredefinedPlace !== true &&
            this.props.fetchDetails === true
        ) {
            if (rowData.isLoading === true) {
                // already requesting
                return;
            }

            Keyboard.dismiss();

            this._abortRequests();

            // display loader
            this._enableRowLoader(rowData);

            // fetch details
            const request = new global.XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) return;

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    if (responseJSON.status === 'OK') {
                        if (this._isMounted === true) {
                            const details = responseJSON.result;
                            this._disableRowLoaders();

                            this.setState({
                                text: this._renderDescription(rowData),
                            });

                            delete rowData.isLoading;
                            this.props.onPress(rowData, details);
                        }
                    } else {
                        this._disableRowLoaders();

                        if (this.props.autoFillOnNotFound) {
                            this.setState({
                                text: this._renderDescription(rowData),
                            });
                            delete rowData.isLoading;
                        }

                        if (!this.props.onNotFound) {
                            console.warn(
                                'google places autocomplete: ' +
                                    responseJSON.status
                            );
                        } else {
                            this.props.onNotFound(responseJSON);
                        }
                    }
                } else {
                    this._disableRowLoaders();

                    if (!this.props.onFail) {
                        console.warn(
                            'google places autocomplete: request could not be completed or has been aborted'
                        );
                    } else {
                        this.props.onFail(
                            'request could not be completed or has been aborted'
                        );
                    }
                }
            };

            request.open(
                'GET',
                `${this.state.url}/place/details/json?` +
                    Qs.stringify({
                        key: this.props.query.key,
                        placeid: rowData.place_id,
                        language: this.props.query.language,
                        ...this.props.GooglePlacesDetailsQuery,
                    })
            );

            request.withCredentials = this.requestShouldUseWithCredentials();

            request.send();
        } else if (rowData.isCurrentLocation === true) {
            // display loader
            this._enableRowLoader(rowData);

            this.setState(
                {
                    text: this._renderDescription(rowData),
                },
                () => {
                    setTimeout(() => {
                        this.setState({
                            listViewDisplayed: false,
                        });
                    }, 500);
                }
            );

            delete rowData.isLoading;
            this.getCurrentLocation();
        } else {
            this.setState(
                {
                    text: this._renderDescription(rowData),
                },
                () => {
                    setTimeout(() => {
                        this.setState({
                            listViewDisplayed: false,
                        });
                    }, 500);
                }
            );

            delete rowData.isLoading;
            let predefinedPlace = this._getPredefinedPlace(rowData);

            // sending predefinedPlace as details for predefined places
            this.props.onPress(predefinedPlace, predefinedPlace);
        }
    };

    _enableRowLoader = rowData => {
        let rows = this.buildRowsFromResults(this._results);
        for (let i = 0; i < rows.length; i++) {
            if (
                rows[i].place_id === rowData.place_id ||
                (rows[i].isCurrentLocation === true &&
                    rowData.isCurrentLocation === true)
            ) {
                rows[i].isLoading = true;
                this.setState({
                    dataSource: rows,
                });
                break;
            }
        }
    };

    _disableRowLoaders = () => {
        if (this._isMounted === true) {
            for (let i = 0; i < this._results.length; i++) {
                if (this._results[i].isLoading === true) {
                    this._results[i].isLoading = false;
                }
            }

            this.setState({
                dataSource: this.buildRowsFromResults(this._results),
            });
        }
    };

    _getPredefinedPlace = rowData => {
        if (rowData.isPredefinedPlace !== true) {
            return rowData;
        }

        for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
            if (
                this.props.predefinedPlaces[i].description ===
                rowData.description
            ) {
                return this.props.predefinedPlaces[i];
            }
        }

        return rowData;
    };

    _filterResultsByTypes = (unfilteredResults, types) => {
        if (types.length === 0) return unfilteredResults;

        const results = [];
        for (let i = 0; i < unfilteredResults.length; i++) {
            let found = false;

            for (let j = 0; j < types.length; j++) {
                if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                results.push(unfilteredResults[i]);
            }
        }
        return results;
    };

    _requestNearby = (latitude, longitude) => {
        this._abortRequests();

        if (
            latitude !== undefined &&
            longitude !== undefined &&
            latitude !== null &&
            longitude !== null
        ) {
            const request = new global.XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    this._disableRowLoaders();

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this._isMounted === true) {
                            var results = [];
                            if (
                                this.props.nearbyPlacesAPI ===
                                'GoogleReverseGeocoding'
                            ) {
                                results = this._filterResultsByTypes(
                                    responseJSON.results,
                                    this.props.filterReverseGeocodingByTypes
                                );
                            } else {
                                results = responseJSON.results;
                            }

                            this.setState({
                                dataSource: this.buildRowsFromResults(results),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        if (!this.props.onFail)
                            console.warn(
                                'google places autocomplete: ' +
                                    responseJSON.error_message
                            );
                        else {
                            this.props.onFail(responseJSON.error_message);
                        }
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };

            let url = '';
            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                // your key must be allowed to use Google Maps Geocoding API
                url =
                    `${this.state.url}/geocode/json?` +
                    Qs.stringify({
                        latlng: latitude + ',' + longitude,
                        key: this.props.query.key,
                        ...this.props.GoogleReverseGeocodingQuery,
                    });
            } else {
                url =
                    `${this.state.url}/place/nearbysearch/json?` +
                    Qs.stringify({
                        location: latitude + ',' + longitude,
                        key: this.props.query.key,
                        ...this.props.GooglePlacesSearchQuery,
                    });
            }

            request.open('GET', url);

            request.withCredentials = this.requestShouldUseWithCredentials();

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    };

    _request = text => {
        this._abortRequests();
        if (
            this.supportedPlatform() &&
            text &&
            text.length >= this.props.minLength
        ) {
            const request = new global.XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.predictions !== 'undefined') {
                        if (this._isMounted === true) {
                            const results =
                                this.props.nearbyPlacesAPI ===
                                'GoogleReverseGeocoding'
                                    ? this._filterResultsByTypes(
                                          responseJSON.predictions,
                                          this.props
                                              .filterReverseGeocodingByTypes
                                      )
                                    : responseJSON.predictions;

                            this._results = results;
                            this.setState({
                                dataSource: this.buildRowsFromResults(results),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        if (!this.props.onFail)
                            console.warn(
                                'google places autocomplete: ' +
                                    responseJSON.error_message
                            );
                        else {
                            this.props.onFail(responseJSON.error_message);
                        }
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };
            if (this.props.preProcess) {
                text = this.props.preProcess(text);
            }
            request.open(
                'GET',
                `${this.state.url}/place/autocomplete/json?&input=` +
                    encodeURIComponent(text) +
                    '&' +
                    Qs.stringify(this.props.query)
            );

            request.withCredentials = this.requestShouldUseWithCredentials();

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    };

    clearText = () => {
        this.setState({
            text: '',
        });
        const onChangeText =
            this.props &&
            this.props.textInputProps &&
            this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText('');
        }
    };

    _onChangeText = text => {
        this._request(text);

        this.setState({
            text: text,
            listViewDisplayed: this._isMounted || this.props.autoFocus,
        });
    };

    _handleChangeText = text => {
        this._onChangeText(text);

        const onChangeText =
            this.props &&
            this.props.textInputProps &&
            this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText(text);
        }
    };

    _getRowLoader() {
        return <ActivityIndicator animating={true} size="small" />;
    }

    _renderRowData = rowData => {
        if (this.props.renderRow) {
            return this.props.renderRow(rowData);
        }

        return (
            <Text
                style={[
                    this.props.suppressDefaultStyles
                        ? {}
                        : defaultStyles.description,
                    this.props.styles.description,
                    rowData.isPredefinedPlace
                        ? this.props.styles.predefinedPlacesDescription
                        : {},
                ]}
                numberOfLines={this.props.numberOfLines}
            >
                {this._renderDescription(rowData)}
            </Text>
        );
    };

    _renderDescription = rowData => {
        if (this.props.renderDescription) {
            return this.props.renderDescription(rowData);
        }
        return rowData.description || rowData.formatted_address || rowData.name;
    };

    _renderLoader = rowData => {
        if (rowData.isLoading === true) {
            return (
                <View
                    style={[
                        this.props.suppressDefaultStyles
                            ? {}
                            : defaultStyles.loader,
                        this.props.styles.loader,
                    ]}
                >
                    {this._getRowLoader()}
                </View>
            );
        }

        return null;
    };

    _renderRow = (rowData = {}, sectionID, rowID) => {
        return (
            <ScrollView
                style={{ flex: 1 }}
                scrollEnabled={this.props.isRowScrollable}
                keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: WINDOW.width }}
                    onPress={() => this._onPress(rowData)}
                >
                    <View
                        style={[
                            this.props.suppressDefaultStyles
                                ? {}
                                : defaultStyles.row,
                            this.props.styles.row,
                            rowData.isPredefinedPlace
                                ? this.props.styles.specialItemRow
                                : {},
                        ]}
                    >
                        {this._renderLoader(rowData)}
                        {this._renderRowData(rowData)}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    _renderSeparator = (sectionID, rowID) => {
        if (rowID === this.state.dataSource.length - 1) {
            return null;
        }

        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={[
                    this.props.suppressDefaultStyles
                        ? {}
                        : defaultStyles.separator,
                    this.props.styles.separator,
                ]}
            />
        );
    };

    _getFlatList = () => {
        const keyGenerator = () =>
            Math.random()
                .toString(36)
                .substr(2, 10);

        if (
            this.supportedPlatform() &&
            (this.state.text !== '' && this.state.listViewDisplayed === true)
        ) {
            return (
                <FlatList
                    scrollEnabled={!this.props.disableScroll}
                    style={[
                        this.props.suppressDefaultStyles
                            ? {}
                            : defaultStyles.listView,
                        this.props.styles.listView,
                    ]}
                    data={this.state.dataSource}
                    keyExtractor={keyGenerator}
                    extraData={[this.state.dataSource, this.props]}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={({ item }) => this._renderRow(item)}
                    ListEmptyComponent={
                        this.state.text.length > this.props.minLength &&
                        this.props.listEmptyComponent
                    }
                    ListHeaderComponent={
                        this.props.renderHeaderComponent &&
                        this.props.renderHeaderComponent(this.state.text)
                    }
                    {...this.props}
                />
            );
        }

        return null;
    };
    render() {
        let {
            onFocus,
            onBlur,
            clearButtonMode,
            InputComp,
            ...userProps
        } = this.props.textInputProps;
        const TextInputComp = InputComp ? InputComp : TextInput;
        return (
            <View
                style={[
                    this.props.suppressDefaultStyles
                        ? {}
                        : defaultStyles.container,
                    this.props.styles.container,
                ]}
                pointerEvents="box-none"
            >
                <View
                    style={[
                        this.props.suppressDefaultStyles
                            ? {}
                            : defaultStyles.textInputContainer,
                        this.props.styles.textInputContainer,
                    ]}
                >
                    <TextInputComp
                        ref="textInput"
                        editable={this.props.editable}
                        returnKeyType={this.props.returnKeyType}
                        keyboardAppearance={this.props.keyboardAppearance}
                        autoFocus={this.props.autoFocus}
                        style={[
                            defaultStyles.textInput,
                            { height: Math.max(40, this.state.inputHeight) },
                        ]}
                        multiline={true}
                        value={this.state.text}
                        placeholder={this.props.placeholder}
                        onSubmitEditing={this.props.onSubmitEditing}
                        placeholderTextColor={this.props.placeholderTextColor}
                        underlineColorAndroid={this.props.underlineColorAndroid}
                        {...userProps}
                        onChangeText={this._handleChangeText}
                        onContentSizeChange={e => {
                            console.log('content change', e.nativeEvent.contentSize.height);
                            this.setState({
                                inputHeight: e.nativeEvent.contentSize.height + 22,
                            });
                        }}
                    />
                    <TouchableOpacity
                        onPress={this.clearText}
                        style={defaultStyles.clearIcon}
                    >
                        <FontAwesome5
                            name="times"
                            style={{ fontSize: 16, color: 'black' }}
                            light
                        />
                    </TouchableOpacity>
                </View>
                {this._getFlatList()}
                {this.props.children}
            </View>
        );
    }
}

GooglePlacesAutocomplete.propTypes = {
    autoFillOnNotFound: PropTypes.bool,
    autoFocus: PropTypes.bool,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    debounce: PropTypes.number,
    editable: PropTypes.bool,
    enableHighAccuracyLocation: PropTypes.bool,
    enablePoweredByContainer: PropTypes.bool,
    fetchDetails: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    getDefaultValue: PropTypes.func,
    GooglePlacesDetailsQuery: PropTypes.object,
    GooglePlacesSearchQuery: PropTypes.object,
    GoogleReverseGeocodingQuery: PropTypes.object,
    isRowScrollable: PropTypes.bool,
    keyboardAppearance: PropTypes.oneOf(['default', 'light', 'dark']),
    listEmptyComponent: PropTypes.func,
    listUnderlayColor: PropTypes.string,
    minLength: PropTypes.number,
    nearbyPlacesAPI: PropTypes.string,
    numberOfLines: PropTypes.number,
    onFail: PropTypes.func,
    onNotFound: PropTypes.func,
    onPress: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onTimeout: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    predefinedPlaces: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    query: PropTypes.object,
    renderDescription: PropTypes.func,
    renderLeftButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    renderRow: PropTypes.func,
    requestUrl: PropTypes.shape({
        url: PropTypes.string,
        useOnPlatform: PropTypes.oneOf(['web', 'all']),
    }),
    returnKeyType: PropTypes.string,
    styles: PropTypes.object,
    suppressDefaultStyles: PropTypes.bool,
    textInputHide: PropTypes.bool,
    textInputProps: PropTypes.object,
    timeout: PropTypes.number,
    underlineColorAndroid: PropTypes.string,
};

GooglePlacesAutocomplete.defaultProps = {
    autoFillOnNotFound: false,
    autoFocus: false,
    currentLocation: false,
    currentLocationLabel: 'Current location',
    debounce: 0,
    editable: true,
    enableHighAccuracyLocation: true,
    enablePoweredByContainer: true,
    fetchDetails: false,
    filterReverseGeocodingByTypes: [],
    getDefaultValue: () => '',
    GooglePlacesDetailsQuery: {},
    GooglePlacesSearchQuery: {
        rankby: 'distance',
        type: 'restaurant',
    },
    GoogleReverseGeocodingQuery: {},
    isRowScrollable: true,
    keyboardAppearance: 'default',
    keyboardShouldPersistTaps: 'always',
    listViewDisplayed: 'auto',
    minLength: 0,
    nearbyPlacesAPI: 'GooglePlacesSearch',
    numberOfLines: 1,
    onFail: () => {},
    onNotFound: () => {},
    onSubmitEditing: () => {},
    onPress: () => {},
    onTimeout: () =>
        console.warn('google places autocomplete: request timeout'),
    placeholder: 'Search',
    placeholderTextColor: '#A8A8A8',
    predefinedPlaces: [],
    predefinedPlacesAlwaysVisible: false,
    query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
    },
    returnKeyType: 'search',
    styles: {},
    suppressDefaultStyles: false,
    textInputHide: false,
    textInputProps: {},
    timeout: 20000,
    underlineColorAndroid: 'transparent',
};

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
    return React.createClass({
        render() {
            return (
                <GooglePlacesAutocomplete
                    ref="GooglePlacesAutocomplete"
                    {...options}
                />
            );
        },
    });
};

export { GooglePlacesAutocomplete, create };
