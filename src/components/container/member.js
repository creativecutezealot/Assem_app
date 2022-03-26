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
import constants from '../../styles/const';
import Background from './background';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import FOAVRoutePicker from '../nativeAudioRoutePicker';

class MemeberContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.audioDeviceSelectRef = React.createRef();
    }

    onBack = () => {
        this.props.back();
    };

    render() {
        const { children, style } = this.props;
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
                    <TouchableOpacity
                        style={[
                            styles.backIconContainer,
                            { flex: 1, justifyContent: 'flex-start' },
                        ]}
                        onPress={this.onBack}
                    >
                        <FontAwesomeIcon
                            name="chevron-left"
                            color={'white'}
                            size={32}
                        />
                        <Text style={styles.backTxt}>BACK</Text>
                    </TouchableOpacity>
                    <Text style={styles.logoTitle}>Assembly</Text>
                    <TouchableOpacity
                        style={[
                            styles.logoIcon,
                            { flex: 1, alignItems: 'flex-end' },
                        ]}
                    >
                        <FontAwesomeIcon
                            name="volume-up"
                            color={'white'}
                            size={32}
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

MemeberContainer.propTypes = {
    children: PropTypes.node,
};

MemeberContainer.defaultProps = {
    children: null,
};

export default MemeberContainer;
