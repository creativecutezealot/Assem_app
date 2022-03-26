import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Dimensions } from 'react-native';
import styles from './styles';
const img_banner = require('../../../assets/images/register/background-club.jpg');
const width = Dimensions.get('window').width;
class ClubHeader extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { club } = this.props;
        const backgroundSource = club?.banner_url ? { uri: club?.banner_url } : img_banner;
        return (
            <ImageBackground source={backgroundSource} style={[styles.headerContainer, { height: width * 0.25 }]} resizeMode="center">
            </ImageBackground>
        );
    }
}

ClubHeader.propTypes = {
    club: PropTypes.object.isRequired,
};

ClubHeader.defaultProps = {
    club: null,
};

export default ClubHeader;