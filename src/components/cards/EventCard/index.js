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

import EventHeader from './header';
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

class EventCard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      moreDes: false,
      showNotify: false,
    };
  }

  componentDidMount() {
    // this.getCurrentViewers();
  }

  componentDidUpdate(prevProps) {
    const { item } = this.props;
    const { item: prevItem } = prevProps;
    if (prevItem && prevItem !== item) {
      if (prevItem.event_id !== item.event_id) {
        // this.getCurrentViewers();
      }
    }
  }

  getCurrentViewers = () => {
    const { item } = this.props;
    const id = item.event_id;
    this.props.getViewerByAssembleRequest({
      id,
    });
  }

  onGotoEvent = async () => {
    const { item, onEndEvent, context } = this.props;
    const { allEvent, updateEventStatus, currentEvent, updateLeavingStatus } = context;
    if (allEvent) {
      console.log('@@@@@ ======== all event entering ======');
      if (item.event_id !== currentEvent.event_id) {
        console.log('@@@@@ ======== another event entering ======');
        updateLeavingStatus(false);
        onEndEvent(async () => {
          await this.onCreateViewer();
        });
        return;
      }
      updateEventStatus(false);
      this.props.navigation.navigate('Assembly', { startCall: false });
      return;
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
        url: ENDPOINTS.notifyEvent(item.event_id),
        data: payload
      });
    } catch (error) {
      console.log('Failed to notify user', error);
      showFlashMsg('Failed to notify user. Please try again', true);
    }
    this.setState({ loading: false });
    this.props.onRefresh();
  }

  render() {
    const { currentViewer, currentEvent } = this.props.context;
    const { item, club } = this.props;
    const { moreDes, showNotify } = this.state;
    const startTime = moment.tz(item.event_time, 'America/Los_Angeles');
    const startHour = startTime.format('hh:mm A');
    const startDay = startTime.format('MM/DD');
    const startTimeZone = startTime.zoneName();
    const currentTime = moment().tz('America/Los_Angeles');
    // // const user_includs = item.is_allow_all || item.selected_users && item.selected_users.includes(global.currentUser.user_id);
    const user_notified = item.notify_users && item.notify_users.includes(global.currentUser.user_id);
    const isStarted = startTime.unix() < currentTime.unix();
    // // if (!user_includs) {
    // //   return null;
    // // }

    // const badgeBgColor = isStarted ? constants.colors.primary_red : user_notified ? constants.colors.primary_blue : constants.colors.gray_dark;
    const iconName = isStarted ? 'sign-in' : 'bell';
    const titleName = isStarted ? 'ENTER' : user_notified ? 'UN-NOTIFY' : 'NOTIFY\nME';
    const transBgColor = isStarted ? '#161017' : user_notified ? constants.colors.primary_blue : '#161017';
    // const badgeText = isStarted ? 'ROOM IS LIVE' : `Starts at ${startHour} ${abbrs[`${startTimeZone}`]} on ${startDay} ${startTime.fromNow()}`;

    const backgroundSource = item && item.photo_url !== '' ? { uri: item.photo_url } : { uri: club.assemble_photo_url };

    return (
      <View style={styles.wrapper}>
        <SanityModal
          show={showNotify}
          msg={`${getDisplayName(item.enter_club_name, '#')} will call you when the Event is live.`}
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
        <EventHeader
          event={item}
        />
        {/* {!isStarted && (
          <View style={[styles.footWrapper]}>
            <Text style={[styles.name]} numberOfLines={1} ellipsizeMode="tail">{badgeText}</Text>
          </View>
        )} */}
        <View style={styles.swipeContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            if (isStarted) {
              // this.onGotoEvent();
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
                currentEvent && item.event_id == currentEvent.event_id ? <PlayIndicator /> : <TransButton
                  onPress={() => {
                    if (isStarted) {
                      // this.onGotoEvent();
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
  const id = item.event_id;
  const user_id = global.currentUser.user_id;
  var viewers = [];
  return {
    viewers: viewers,
  };
};
const mapDispatchToProps = {
  getViewerByAssembleRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMainContext(EventCard));