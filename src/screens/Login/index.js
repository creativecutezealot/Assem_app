import React from 'react';
import { View, Image } from 'react-native';

import styles from './styles';
import MainButton from '../../components/buttons/MainButton';
import SplashScreen from 'react-native-splash-screen';
import { Container } from '../../components/index';

class Login extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        SplashScreen.hide();
    }

    goJoinCode = () => {
        this.props.navigation.navigate('EnterPhone');
    };

    goSignIn = () => {
        this.props.navigation.navigate('LoginInput');
    };

    render() {
        return (
            <Container header={false}>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/images/register/logo.png')}
                        style={styles.logoWrapper}
                    />
                    <MainButton
                        label={'SIGN IN'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.goSignIn()}
                    />
                    {/* <MainButton label={'JOIN NOW'} styleWrapper={styles.btnWrapper} onPress={() => this.goJoinCode()} />
                    <View style={styles.textWrapper}>
                        <TouchableOpacity onPress={() => this.goSignIn()}>
                            <Text style={styles.signBtn}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </Container>
        );
    }
}

export default Login;
