import React from 'react';
import { Provider } from 'react-redux';
import 'react-native-get-random-values';
import App from './routers';
import store from './store';
import { ProgressTrackingService } from './services/progressTrackService';

const Setup = () => {
	ProgressTrackingService.startTracking();
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};

export default Setup;

