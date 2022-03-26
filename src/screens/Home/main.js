import React, { createRef } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    AppState,
    InteractionManager,
} from 'react-native';
import { withMainContext, SORT_TYPE } from '../../context';

import styles from './styles';
import Navigation from '../../routers/navigation';
import {
    AssembleCard,
    VoiceCard,
    AudioCard,
    ActionBtns,
} from '../../components/index';
import MessageScreen from '../MessageScreen';

export const Main = (sortType, refreshing, onRefresh, getItemLayout, keyExtractor) => {

    renderItem = ({ item, index }) => {
        const { club } = this.props;
        if (item.audio_id && item.audio_id !== '') {
            return (
                <AudioCard
                    item={item}
                    club={club}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndAudio={this._showEndAudioModal}
                    onEndRoom={this._showEndRoomModal}
                />
            );
        }

        if (item.assemble_id && item.assemble_id !== '') {
            return (
                <AssembleCard
                    innerRef={this.assembleItemRef}
                    key={item.assemble_id}
                    item={item}
                    club={club}
                    navigation={this.props.navigation}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndRoom={this._showEndRoomModal}
                    onEndAudio={this._showEndAudioModal}
                    currentTime={this.state.currentTime}
                />
            );
        }

        if (item.voicenote_id && item.voicenote_id !== '') {
            return (
                <VoiceCard
                    item={item}
                    club={club}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndAudio={this._showEndAudioModal}
                    onEndRoom={this._showEndRoomModal}
                />
            );
        }
        return null;
    };

    return <View style={styles.assembleContainer}>
        {sortType !== SORT_TYPE.voicenotes && (
            <FlatList
                ref={this.assembleListRef}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom:
                        allRoom || allAudio
                            ? this.state.bottomHeight
                            : 0,
                }}
                refreshControl={
                    <RefreshControl
                        colors={['#9Bd35A', '#689F38']}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                getItemLayout={getItemLayout}
                keyExtractor={keyExtractor}
                data={flatData}
                extraData={this.props}
                ListEmptyComponent={this.renderEmpty(sortType)}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={
                    flatData.length > 0
                        ? this.renderFooter(sortType)
                        : null
                }
                renderItem={this.renderItem}
            />
        )}
        {sortType === SORT_TYPE.voicenotes && (
            <>
                {this.renderHeader()}
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <MessageScreen />
                    </View>
                </View>
            </>
        )}
        <ActionBtns toggleSortType={this.props.context.toggleSortType} />
    </View>
}