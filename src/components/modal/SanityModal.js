// @flow

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
    TouchableOpacity,
} from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import AlertModal from './AlertModal';
import constants from '../../styles/const';

function SanityModal({
    show = false,
    msg = '',
    confirmText = 'OK',
    cancelText = '',
    onConfirm,
    onCancel,
    hasClose = true
}) {
    const btnWidth = cancelText == '' ? 160 : 100;
    return (
        <AlertModal modalStyle={styles.root} isVisible={show}>
            {
                hasClose && <View style={{ alignSelf: 'flex-start' }}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
                        <FontAwesomeIcon name={'times'} size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
            }
            <View style={styles.msgContainer}>
                <Text style={styles.msgText}>{msg}</Text>
            </View>
            <View style={styles.actionContainer}>
                {cancelText !== '' && (
                    <>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={[styles.cancelBtnContainer, { width: btnWidth }]}
                        >
                            <Text
                                style={{
                                    color: constants.colors.white,
                                    fontFamily:
                                        constants.fonts.proximaNovaRegular,
                                    fontSize: 14,
                                }}
                            >
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ width: 20 }} />
                    </>
                )}
                <TouchableOpacity
                    onPress={onConfirm}
                    style={[styles.btnContainer, { width: btnWidth }]}
                >
                    <Text
                        style={{
                            color: constants.colors.white,
                            fontFamily: constants.fonts.proximaNovaRegular,
                            fontSize: 14,
                        }}
                    >
                        {confirmText}
                    </Text>
                </TouchableOpacity>
            </View>
        </AlertModal>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: constants.colors.background,
    },
    closeBtn: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    msgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10%',
        marginTop: 20,
    },
    msgText: {
        textAlign: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 18,
        fontFamily: constants.fonts.proximaNovaRegular,
    },
    btnContainer: {
        marginTop: 36,
        width: 100,
        alignSelf: 'center',
        height: 36,
        backgroundColor: constants.colors.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    cancelBtnContainer: {
        marginTop: 36,
        width: 100,
        alignSelf: 'center',
        height: 36,
        backgroundColor: constants.colors.gray_dark,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    }
});

export default SanityModal;
