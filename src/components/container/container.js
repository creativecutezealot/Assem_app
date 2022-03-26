import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StatusBar, View, ScrollView } from 'react-native';
import styles from './styles';
import constants from '../../styles/const';
import Background from './background';
import NavHeader from '../header';
import AuthNavHeader from '../header/auth';
class Container extends React.PureComponent {
    render() {
        const {
            children,
            style,
            header = true,
            scrollEnabled = false,
            title = '',
            onBackPress = null,
            hiddenBack = false,
            contentNonScroll = false,
            isHome = false,
            backType = 'close',
        } = this.props;
        const backgroundColor = constants.colors.background;
        const colors = ['#131118', '#1f1b29', '#131118'];
        return (
            <SafeAreaView style={[styles.container, style]}>
                <Background colors={colors} />
                <StatusBar
                    backgroundColor={backgroundColor}
                    barStyle={'light-content'}
                />
                {header &&
                    (isHome ? (
                        <NavHeader
                            title={title}
                            onBackPress={onBackPress}
                            isHome={isHome}
                            hiddenBack={hiddenBack}
                            backType={backType}
                        />
                    ) : (
                        <AuthNavHeader />
                    ))}
                {contentNonScroll ? (
                    <View style={{ flex: 1 }}>{children}</View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        scrollEnabled={scrollEnabled}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                )}
            </SafeAreaView>
        );
    }
}

Container.propTypes = {
    children: PropTypes.node,
    header: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
};

Container.defaultProps = {
    children: null,
    header: true,
    scrollEnabled: false,
};

export default Container;
