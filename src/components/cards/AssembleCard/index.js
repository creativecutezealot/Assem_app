import React from 'react';
import { TouchableOpacity, View, Text, ImageBackground } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { withMainContext } from '../../../context';
import { request as getViewerByAssembleRequest } from '../../../actions/viewer/getViewerByAssemble';
import styles from './styles';
import constants from '../../../styles/const';
import { parseJSONorNot, getDisplayName, showFlashMsg } from '../../../helpers/utils';

import axiosAjax from '../../../api/axiosConf';
import APIConfig from '../../../api/const';
import { normailzeQSData } from '../../../saga/normalize';
import TransButton from '../../transbutton';
import SanityModal from '../../modal/SanityModal';

import AssembleHeader from './header';
import PlayIndicator from '../AudioCard/playIndicator';

const abbrs = {
  EST: 'EST',
  EDT: 'EDT',
  CST: 'CST',
  CDT: 'CDT',
  MST: 'MST',
  MDT: 'MDT',
  PST: 'PST',
  PDT: 'PDT',
};

const img_person = require('../../../assets/images/home/active_person.png');
const img_holder = require('../../../assets/images/home/holder0.png');
const img_call_join = require('../../../assets/images/home/call_join.png');
const img_call_exit = require('../../../assets/images/home/call_exit.png');
const ENDPOINTS = APIConfig.apiEndpoints;
const limitStrLen = 80;

class AssembleCard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      moreDes: false,
      showNotify: false,
    };
  }

  componentDidMount() {
    this.getCurrentViewers();
  }

  componentDidUpdate(prevProps) {
    const { item } = this.props;
    const { item: prevItem } = prevProps;
    if (prevItem && prevItem !== item) {
      if (prevItem.assemble_id !== item.assemble_id) {
        this.getCurrentViewers();
      }
    }
  }

  getCurrentViewers = () => {
    const { item } = this.props;
    const id = item.assemble_id;
    this.props.getViewerByAssembleRequest({
      id,
    });
  }

  onGotoRoom = async () => {
    const { item, onEndRoom, onEndAudio, context } = this.props;
    const { allRoom, updateRoomStatus, currentViewer, currentRoom, allAudio, updateCurrentViewer, updateLeavingStatus } = context;
    if (allAudio || allRoom) {
      if (allAudio) {
        console.log('@@@@@ ======== all audio entering ======');
        onEndAudio(() => {
          this.onCreateViewer();
        });
        return;
      }
      if (allRoom) {
        console.log('@@@@@ ======== all room entering ======');
        if (item.assemble_id !== currentRoom.assemble_id) {
          console.log('@@@@@ ======== another room entering ======');
          updateLeavingStatus(false);
          onEndRoom(async () => {
            await this.onCreateViewer();
          });
          return;
        }
        updateRoomStatus(false);
        this.props.navigation.navigate('Assembly', { startCall: false });
        return;
      }
    } else {
      this.onCreateViewer();
    }
  };


  onCreateViewer = async () => {
    const { item, context } = this.props;
    const {
      allRoom,
      updateRoomStatus,
      currentViewer,
      currentRoom,
      updateCurrentViewer,
      updateCurrentRoom,
      allAudio,
    } = context;
    let beforeAssembleId = currentRoom ? currentRoom.assemble_id : '';
    updateCurrentRoom(item);
    this.setState({ loading: true });
    const currentUser = global.currentUser;
    const payload = {
      channel_id: item.assemble_id,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      photo_url: currentUser.photo_url,
      handup: item.is_enter_stage,
      handselect: item.is_enter_stage,
    };
    try {
      const { data } = await axiosAjax({
        method: 'post',
        url: ENDPOINTS.createViewer(),
        data: normailzeQSData(payload)
      });
      // ????? do not remove these under console ?????
      console.log('@@@@@@ create viewer api ');
      console.log(payload);
      console.log(data);
      this.setState({ loading: false });
      if (data.error) {
        showFlashMsg('Unable to join room. Please try again', true);
      } else {
        updateCurrentViewer(data.data);
        this.getCurrentViewers();
        this.props.navigation.navigate('Assembly', { startCall: true });
        if (beforeAssembleId != '') {
          this.props.getViewerByAssembleRequest({
            id: beforeAssembleId,
          });
        }
      }
    } catch (error) {
      showFlashMsg('Unable to join room. Please try again', true);
    }
  };

  handleNotifyModal = () => {
    this.setState({
      showNotify: !this.state.showNotify
    });
  }

  notifyUser = async (notified) => {
    this.setState({ loading: true });
    const { item } = this.props;
    const payload = {
      notified
    };
    try {
      await axiosAjax({
        method: 'patch',
        url: ENDPOINTS.notifyAssemble(item.assemble_id),
        data: payload
      });
    } catch (error) {
      showFlashMsg('Failed to notify user. Please try again', true);
    }
    this.setState({ loading: false });
    this.props.onRefresh();
  }

  render() {
    const { currentViewer, currentRoom } = this.props.context;
    const { item, currentTime, viewers, club } = this.props;
    const { moreDes, showNotify } = this.state;
    const startTime = moment.tz(item.start_time, 'America/Los_Angeles');
    const startHour = startTime.format('hh:mm A');
    const startDay = startTime.format('MM/DD');
    const startTimeZone = startTime.zoneName();
    const currrentTime = moment().tz('America/Los_Angeles');
    const user_includs = item.is_allow_all || item.selected_users && item.selected_users.includes(global.currentUser.user_id);
    const user_notified = item.notify_users && item.notify_users.includes(global.currentUser.user_id);
    const isStarted = typeof item.is_immediately === 'string' ? item.is_immediately === 'true' : item.is_immediately || startTime.unix() < currrentTime.unix();
    if (!user_includs) {
      return null;
    }

    const badgeBgColor = isStarted ? constants.colors.primary_red : user_notified ? constants.colors.primary_blue : constants.colors.gray_dark;
    const iconName = isStarted ? 'sign-in' : 'bell';
    const titleName = isStarted ? 'ENTER' : user_notified ? 'UN-NOTIFY' : 'NOTIFY\nME';
    const transBgColor = isStarted ? '#161017' : user_notified ? constants.colors.primary_blue : '#161017';
    const badgeText = isStarted ? 'ROOM IS LIVE' : `Starts at ${startHour} ${abbrs[`${startTimeZone}`]} on ${startDay} ${startTime.fromNow()}`;

    const backgroundSource = item && item.photo_url !== '' ? { uri: item.photo_url } : { uri: club.assemble_photo_url };
    const disabledBanner = true;
    return (
      <View style={styles.wrapper}>
        <SanityModal
          show={showNotify}
          msg={`${getDisplayName(item.enter_club_name, '#')} will call you when the Room is live.`}
          onCancel={this.handleNotifyModal}
          cancelText={`I'll stay`}
          hasClose={false}
          onConfirm={() => {
            this.handleNotifyModal();
            setTimeout(() => {
              this.notifyUser(!user_notified);
            }, 500);
          }}
        />
        <AssembleHeader
          room={currentRoom}
          assemble={item}
          viewers={viewers}
        />
        {!isStarted && (
          <View style={[styles.footWrapper]}>
            <Text style={[styles.name]} numberOfLines={1} ellipsizeMode="tail">{badgeText}</Text>
          </View>
        )}
        <View style={styles.swipeContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            if (isStarted) {
              this.onGotoRoom();
            } else {
              if (!user_notified) {
                this.handleNotifyModal();
              } else {
                this.notifyUser(!user_notified);
              }
            }
          }}>
            <ImageBackground source={backgroundSource} style={styles.headerContainer}>
              {
                currentRoom && item.assemble_id == currentRoom.assemble_id ? <PlayIndicator /> : <TransButton
                  onPress={() => {
                    if (isStarted) {
                      this.onGotoRoom();
                    } else {
                      if (!user_notified) {
                        this.handleNotifyModal();
                      } else {
                        this.notifyUser(!user_notified);
                      }
                    }
                  }}
                  iconName={iconName}
                  title={titleName}
                  bgColor={transBgColor}
                  iconType={1}>
                </TransButton>
              }
            </ImageBackground>
          </TouchableOpacity>
          {item?.description !== '' &&
            <View style={styles.descriptionWrapper}>
              <Hyperlink linkDefault={true} linkStyle={{ color: constants.colors.primary_blue }}>
                <Text style={styles.name}>{item.description.length > limitStrLen && !moreDes ? `${item.description.substring(0, limitStrLen)}...` : item.description}</Text>
              </Hyperlink>
              {item.description.length > limitStrLen && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', marginTop: 16 }}>
                  <Text onPress={() => {
                    this.setState({
                      moreDes: !moreDes
                    });
                  }} style={[styles.headerName, { fontSize: 14 }]}>{!moreDes ? 'MORE' : 'LESS'}</Text>
                </View>
              )}
            </View>
          }
        </View>
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { item } = props;
  const id = item.assemble_id;
  const user_id = global.currentUser.user_id;
  var viewers = [];
  const viewersData = state.viewersData[id];
  if (viewersData && viewersData.data) {
    viewers = viewersData.data.data;
  }

  const viewerCreate = state.viewerData[user_id];
  if (viewerCreate && viewerCreate.data) {
    const viewer = viewerCreate.data.data;
    if (viewer && viewer.channel_id === id) {
      const activeIndex = viewers.findIndex(r => r.viewer_id === viewer.viewer_id);
      if (activeIndex < 0) {
        viewers = [...viewers, viewer];
      } else {
        viewers[activeIndex] = viewer;
      }
    }
  }

  const socketData = state.socket.data;
  const topic = state.socket.topic;
  var socket_viewer = null;
  if (socketData && typeof parseJSONorNot(socketData) === 'object') {
    socket_viewer = parseJSONorNot(socketData);
    if (socket_viewer.channel_id === id) {
      const activeIndex = viewers.findIndex(r => r.viewer_id === socket_viewer.viewer_id);
      if (topic.includes('update')) {
        if (activeIndex !== -1) {
          viewers[activeIndex] = socket_viewer;
        }
      } else if (topic.includes('delete')) {
        if (activeIndex !== -1) {
          viewers.splice(activeIndex, 1);
        }
      } else if (topic.includes('create')) {
        if (activeIndex === -1) {
          viewers.push(socket_viewer);
        }
      }
    }
    console.log('@@@@@ socket data');
  }

  const filtered_viewers = viewers.filter(v => v.viewer_id && v.viewer_id != '');
  return {
    viewers: filtered_viewers,
  };
};
const mapDispatchToProps = {
  getViewerByAssembleRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMainContext(AssembleCard));