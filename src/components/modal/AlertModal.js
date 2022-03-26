// @flow

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

function AlertModal({ modalStyle, isVisible = false, onModalShow, children }) {
    return (
        <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={250}
            animationOutTiming={250}
            useNativeDriver={true}
            backdropOpacity={0.6}
            isVisible={isVisible}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: 16 }}
            onModalShow={onModalShow}
        >
            <View style={[styles.root, modalStyle]}>{children}</View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 20,
        paddingBottom: 36,
    },
});

export default memo(AlertModal);
