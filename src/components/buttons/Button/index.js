// @flow

import React, { isValidElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Touchable from '../../touchable';

function Button({
  floatingStyle,
  touchableStyle,
  buttonStyle,
  textStyle,
  disabled = false,
  onPress,
  onPressIn,
  text,
  activeOpacity = 0.5,
  content,
}) {
  const renderButton = () => {
    return (
      <Touchable
        style={touchableStyle}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        activeOpacity={activeOpacity}>
        <View style={[styles.root, buttonStyle]}>
          {isValidElement(content) ? (
            content
          ) : (
            <Text style={[styles.title, textStyle]}>{text}</Text>
          )}
        </View>
      </Touchable>
    );
  };

  return floatingStyle ? (
    <View style={floatingStyle}>{renderButton()}</View>
  ) : (
    renderButton()
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

export default Button;
