import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { Container, MainButton } from '../../components/index';

class CompleteResetPass extends React.PureComponent {
    goNext = () => {
        this.props.navigation.navigate('LoginInput');
    };
    render() {
        return (
            <Container header={false}>
                <View style={styles.container}>
                    <View style={styles.complete}>
                        <View style={styles.complete_guideWrapper}>
                            <Text style={styles.guide}>YOUR PASSWORD HAS BEEN</Text>
                            <Text style={styles.guide}>CHANGED SUCCESSFULLY</Text>
                            <Text style={styles.guideDes}>
                                {'You will show be returned to the login screen'}
                            </Text>
                        </View>
                        <MainButton
                            label={'NEXT'}
                            styleWrapper={styles.btnWrapper}
                            onPress={() => this.goNext()}
                        />
                    </View>
                </View>
            </Container>
        );
    }
}
export default CompleteResetPass;
