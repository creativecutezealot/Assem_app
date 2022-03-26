import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { getObjInfo, checkPermissions } from '../../helpers/utils';
import constVal from '../../helpers/constant';
import NavigationService from '../../routers/navigation';
import { Container } from '../../components/index';

class Splash extends React.Component {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const userInfo = await getObjInfo(constVal.USER_KEY);
        SplashScreen.hide();
        if (userInfo) {
            if (userInfo.approved) {
                if (userInfo.loggedin) {
                    global.currentUser = userInfo;
                    checkPermissions();
                    NavigationService.navigate('Start');
                } else {
                    NavigationService.navigate('Tutorial');
                }
            } else {
                NavigationService.navigate('Auth');
            }
        } else {
            NavigationService.navigate('Auth');
        }
    }

    render() {
        return (
            <Container header={false}>
                {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/images/register/logo.png')} style={styles.logoWrapper} resizeMode="center" />
                </View> */}
            </Container>
        );
    }
}

export default Splash;
