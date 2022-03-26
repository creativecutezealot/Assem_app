import { NavigationActions, StackActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
let _navigator;
function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef;
}
function navigate(routeName, params) {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params,
		})
	);
}
function back() {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(NavigationActions.back());
}
function push(routeName, params) {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(
		StackActions.push({
			routeName,
			params,
		})
	);
}
function popToTop(routeName, params) {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(StackActions.popToTop());
}
function openDrawer() {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(DrawerActions.openDrawer());
}

function closeDrawer() {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(DrawerActions.closeDrawer());
}

function setNavParam(key, params) {
	if (!_navigator) {
		return;
	}
	_navigator.dispatch(NavigationActions.setParams({ key, params }));
}
export default {
	navigate,
	setTopLevelNavigator,
	back,
	push,
	popToTop,
	openDrawer,
	closeDrawer,
	setNavParam,
};
