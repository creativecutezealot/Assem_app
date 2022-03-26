import React from 'react';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Navigation from '../../routers/navigation';
import constants from '../../styles/const';
import { SORT_TYPE } from '../../context';
const ActionBtns = props => {
    const { offsetY = 20, offsetX = 10, toggleSortType } = props;
    return (
        <ActionButton
            size={64}
            offsetY={offsetY}
            offsetX={offsetX}
            renderIcon={() => {
                return (
                    <FontAwesome5Pro
                        name="plus"
                        style={styles.actionButtonIcon}
                    />
                );
            }}
            buttonColor={constants.colors.primary}
        >
            <ActionButton.Item
                size={50}
                buttonColor={constants.colors.primary}
                title={'Messages'}
                textStyle={styles.textStyle}
                textContainerStyle={styles.textContainerStyle}
                spaceBetween={2}
                onPress={() => {
                    // Navigation.navigate('MyClubsModal');
                    toggleSortType(SORT_TYPE.voicenotes);
                }}
            >
                <FontAwesome5Pro
                    name="comment"
                    style={styles.actionButtonIcon}
                />
            </ActionButton.Item>
            <ActionButton.Item
                size={50}
                buttonColor={constants.colors.primary}
                title={'Members'}
                textStyle={styles.textStyle}
                textContainerStyle={styles.textContainerStyle}
                spaceBetween={2}
                onPress={() => {
                    Navigation.navigate('ClubMembersModal');
                }}
            >
                <FontAwesome5Pro name="users" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            {/* <ActionButton.Item
				size={50}
				buttonColor={constants.colors.primary}
				title={'New Message'}
				textStyle={styles.textStyle}
				textContainerStyle={styles.textContainerStyle}
				spaceBetween={2}
				onPress={() => {
					Navigation.navigate('UserSelectorScreen');
				}}>
				<FontAwesome5Pro name="edit" style={styles.actionButtonIcon} />
			</ActionButton.Item> */}
            <ActionButton.Item
                size={50}
                buttonColor={constants.colors.primary}
                title={'Start Room'}
                textStyle={styles.textStyle}
                textContainerStyle={styles.textContainerStyle}
                spaceBetween={2}
                onPress={() => {
                    Navigation.navigate('StartAssemlbyModal');
                }}
            >
                <FontAwesome5Pro
                    name="plus-circle"
                    style={styles.actionButtonIcon}
                />
            </ActionButton.Item>
        </ActionButton>
    );
};

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 24,
        color: 'white',
    },
    textContainerStyle: {
        backgroundColor: constants.colors.white,
        borderWidth: 0,
    },
    textStyle: {
        fontSize: 14,
        backgroundColor: 'transparent',
        color: constants.colors.background,
        fontWeight: '500',
    },
});

export default ActionBtns;
