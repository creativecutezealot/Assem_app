/// Error Code
// Error : Auth error 401
// Error : Forbidden error 403
// Error : Not found 404
// Error: API Route Method Not Allowed 405
// Error : Validation Message 422
// Error : Internal server error 500
////////////////////////////////

import axios from 'axios';
import store from '../store';
import { logout as logoutRequest } from '../actions/auth/logout';
import NavigationService from '../routers/navigation';
import ApiConstants from './const';
import { clearInfo } from '../helpers/utils';
const baseURL = ApiConstants.apiSite;
/// Axios config
axios.defaults.timeout = 60 * 1000;
const axiosInstance = axios.create({
	baseURL,
});

axiosInstance.interceptors.request.use(
	async config => {
		if (global.currentUser && global.currentUser['api_token']) {
			const token = global.currentUser['api_token'];
			config.headers['x-access-token'] = `${token}`;
		}
		return config;
	},
	error => Promise.reject(error)
);

/**
 * 403 error is expected behavior for /users/social/connect/
 * and default logout logic should be skipped
 */
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			if (error.response.status === 401) {
				logOut();
			} else if (error.response.status === 403) {
				logOut();
			} else if (error.response.status === 404) {
				console.log('404 error');
			} else if (error.response.status === 405) {
				console.log(error.response.status, error.response.config);
			} else if (error.response.status === 422) {
				console.log(error.response.status, error.response.config);
			} else if (error.response.status >= 500) {
				console.log(error.response.status, error.response.config);
			}
		}
		return Promise.reject(error);
	}
);

/// Logout
const logOut = async () => {
	store.dispatch(logoutRequest());
	await clearInfo();
	NavigationService.navigate('Auth');
};
export default axiosInstance;
