// @flow

import React from 'react';
import {
    Platform,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native';
import { preventDoubleTap } from '../../helpers/utils';

export default class Touchable extends React.PureComponent {
    static defaultProps = {
        activeOpacity: 1,
        underlayColor: 'transparent',
        isTouchable: false,
    };

    isUnderlay = false;

    onShowUnderlay = () => {
        this.isUnderlay = true;
    };

    onHideUnderlay = () => {
        this.isUnderlay = false;
    };

    onPress = preventDoubleTap(() => {
        this.props.onPress();
    });

    onPressIn = () => {
        this.props.onPressIn();
    };

    onLongPress = () => {
        this.props.onLongPress();
    };

    render() {
        const {
            style,
            disabled,
            onPress,
            onPressIn,
            onLongPress,
            children,
            underlayColor,
            activeOpacity,
            isTouchable,
        } = this.props;
        const TouchableComp =
            Platform.OS === 'android'
                ? isTouchable
                    ? TouchableOpacity
                    : TouchableNativeFeedback
                : TouchableHighlight;
        return (
            <TouchableComp
                style={style}
                onPress={onPress && this.onPress}
                onPressIn={onPressIn && this.onPressIn}
                onLongPress={onLongPress && this.onLongPress}
                underlayColor={underlayColor}
                activeOpacity={activeOpacity}
                onShowUnderlay={this.onShowUnderlay}
                onHideUnderlay={this.onHideUnderlay}
                disabled={disabled}
            >
                {children}
            </TouchableComp>
        );
    }
}
