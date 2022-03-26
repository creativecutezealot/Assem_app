import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, ImageBackground, Dimensions } from 'react-native';

import styles from './styles';
import TransButton from '../../transbutton';

const img_user = require('../../../assets/images/register/user.png');
const img_banner = require('../../../assets/images/register/background-club.jpg');
const { width, height } = Dimensions.get('window');
class CarouselCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      access_code: ''
    };
  }

  componentDidUpdate(prevPorps) {
    if (this.props.disabled !== prevPorps.disabled) {
      this.setState({
        access_code: ''
      });
    }
  }

  onChangeCode = (access_code) => {
    this.setState({
      access_code
    });
  }

  render() {
    const {
      onPress, item, isAssemble = false, disabled = false
    } = this.props;
    const { access_code } = this.state;
    const backgroundSource = item.photo_url ? { uri: item.photo_url } : img_banner;
    return (
      <TouchableOpacity onPress={() => {
        onPress(item, access_code);
      }}>
        <ImageBackground source={backgroundSource} style={styles.container}  >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TransButton
              onPress={() => {
                onPress(item, access_code);
              }}
              iconName={'sign-in'}
              title="ENTER"
              iconType={1}
            >
            </TransButton>
          </View>
          {disabled && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>YOU ARE A MEMBER</Text>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

CarouselCard.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

CarouselCard.defaultProps = {
  item: null,
};

export default CarouselCard;