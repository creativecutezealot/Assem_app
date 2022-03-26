import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { SORT_TYPE } from '../../context';
import Navigation from '../../routers/navigation';
import constants from '../../styles/const';
import Background from './background';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import FOAVRoutePicker from '../nativeAudioRoutePicker';

class HomeContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            viewer: null,
            muted: false,
            handup: false,
        };
        this.audioDeviceSelectRef = React.createRef();
    }

    onBack = () => {
        this.props.back();
    };

    render() {
        const {
            children,
            style,
            isShowBack,
            isHome = false,
            centerTitle = 'ALL ROOMS',
            toggleSortType,
            sortType,
            onSwitchAllContent = () => { },
        } = this.props;
        const backgroundColor = constants.colors.background;
        const colors = ['#131118', '#1f1b29', '#131118'];
        return (
            <SafeAreaView style={[styles.container, style]}>
                <Background colors={colors} />
                <StatusBar
                    backgroundColor={backgroundColor}
                    barStyle={'light-content'}
                />

                <View style={styles.logoWrapper}>
                    {isShowBack ? (
                        <TouchableOpacity
                            style={styles.logoIcon}
                            onPress={this.onBack}
                        >
                            <FontAwesomeIcon
                                name="chevron-left"
                                color={'white'}
                                size={32}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.logoIcon}
                            onPress={() => Navigation.openDrawer()}
                        >
                            <FontAwesomeIcon
                                name="bars"
                                color={'white'}
                                size={24}
                                light
                            />
                        </TouchableOpacity>
                    )}
                    {isHome ? (
                        <View style={styles.mainHeaderContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    toggleSortType(SORT_TYPE.assemble_all);
                                }}
                                style={[
                                    styles.mainHeaderItem,
                                    {
                                        backgroundColor:
                                            !sortType ||
                                                sortType === SORT_TYPE.none ||
                                                sortType ===
                                                SORT_TYPE.assemble_all ||
                                                sortType === SORT_TYPE.assemble_live
                                                ? constants.colors.primary_blue
                                                : 'transparent',
                                    },
                                ]}
                            >
                                <Text style={styles.mainHeaderTitle}>
                                    ROOMS
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    toggleSortType(SORT_TYPE.audios);
                                }}
                                style={[
                                    styles.mainHeaderItem,
                                    {
                                        backgroundColor:
                                            sortType === SORT_TYPE.audios
                                                ? constants.colors.primary_blue
                                                : 'transparent',
                                    },
                                ]}
                            >
                                <Text style={styles.mainHeaderTitle}>
                                    AUDIO
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    toggleSortType(SORT_TYPE.events);
                                }}
                                style={[
                                    styles.mainHeaderItem,
                                    {
                                        backgroundColor:
                                            sortType === SORT_TYPE.events
                                                ? constants.colors.primary_blue
                                                : 'transparent',
                                    },
                                ]}
                            >
                                <Text style={styles.mainHeaderTitle}>
                                    EVENTS
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={onSwitchAllContent}
                            style={[
                                styles.allRoomsHeaderItem,
                                {
                                    backgroundColor:
                                        constants.colors.primary_blue,
                                },
                            ]}
                        >
                            <FontAwesomeIcon
                                name="arrow-alt-down"
                                solid
                                style={styles.icon}
                            />
                            <Text style={styles.mainHeaderTitle}>
                                {centerTitle}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.logoIcon}>
                        <FontAwesomeIcon
                            name="headphones"
                            color={'white'}
                            size={24}
                            light
                        />
                        <FOAVRoutePicker style={styles.avRoutePicker} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>{children}</View>
            </SafeAreaView>
        );
    }
}

HomeContainer.propTypes = {
    children: PropTypes.node,
};

HomeContainer.defaultProps = {
    children: null,
};

export default HomeContainer;
