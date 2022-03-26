import { Animated, Easing, Platform } from 'react-native';
import constants from '../styles/const';
export function fromLeft(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ layout, position, scene }) => {
			const { index } = scene;
			const { initWidth } = layout;

			const translateX = position.interpolateNode({
				inputRange: [index - 1, index, index + 1],
				outputRange: [-initWidth, 0, 0],
			});

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index - 0.99, index],
				outputRange: [0, 1, 1],
			});

			return { opacity, transform: [{ translateX }] };
		},
	};
}

export function fromTop(duration = 300) {
	return {
		containerStyle: {
			backgroundColor: constants.colors.primary,
		},
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ layout, position, scene }) => {
			const { index } = scene;
			const { initHeight } = layout;

			const translateY = position.interpolateNode({
				inputRange: [index - 1, index, index + 1],
				outputRange: [-initHeight, 0, 0],
			});

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index - 0.99, index],
				outputRange: [0, 1, 1],
			});

			return { opacity, transform: [{ translateY }] };
		},
	};
}

export function fromRight(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ layout, position, scene }) => {
			const { index } = scene;
			const { initWidth } = layout;

			const translateX = position.interpolateNode({
				inputRange: [index - 1, index, index + 1],
				outputRange: [initWidth, 0, 0],
			});

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index - 0.99, index],
				outputRange: [0, 1, 1],
			});

			return { opacity, transform: [{ translateX }] };
		},
	};
}

export function fromBottom(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ layout, position, scene }) => {
			const { index } = scene;
			const { initHeight } = layout;

			const translateY = position.interpolateNode({
				inputRange: [index - 1, index, index + 1],
				outputRange: [initHeight, 0, 0],
			});

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index - 0.99, index],
				outputRange: [0, 1, 1],
			});

			return { opacity, transform: [{ translateY }] };
		},
	};
}

export function fadeIn(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index],
				outputRange: [0, 1],
			});

			return { opacity };
		},
	};
}

export function fadeOut(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;

			const opacity = position.interpolateNode({
				inputRange: [index - 1, index, index + 1],
				outputRange: [0, 1, 0],
			});

			return { opacity };
		},
	};
}

export function zoomIn(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;
			let start = 0;

			if (Platform.OS !== 'ios') {
				start = 0.005;
			}

			const scale = position.interpolateNode({
				inputRange: [index - 1, index],
				outputRange: [start, 1],
			});

			return { transform: [{ scale }] };
		},
	};
}

export function zoomOut(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;

			const scale = position.interpolateNode({
				inputRange: [index - 1, index],
				outputRange: [10, 1],
			});

			return { transform: [{ scale }] };
		},
	};
}

export function flipY(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;

			const rotateY = position.interpolateNode({
				inputRange: [index - 1, index],
				outputRange: ['180deg', '0deg'],
			});

			return { transform: [{ rotateY }], backfaceVisibility: 'hidden' };
		},
	};
}

export function flipX(duration = 300) {
	return {
		transitionSpec: {
			duration,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: ({ position, scene }) => {
			const { index } = scene;

			const rotateX = position.interpolateNode({
				inputRange: [index - 1, index],
				outputRange: ['180deg', '0deg'],
			});

			return { transform: [{ rotateX }], backfaceVisibility: 'hidden' };
		},
	};
}

export const handleTransition = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];
	const nextScene = scenes[scenes.length - 1];
	if (prevScene && nextScene.route.routeName === 'StartAssemlbyModal') {
		return fromBottom();
	} else if (prevScene && nextScene.route.routeName === 'VoiceNoteModal') {
		return fromBottom();
	} else if (prevScene && nextScene.route.routeName === 'MyClubsModal') {
		return fromBottom();
	}
};

export const handleCardStyle = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];
	const nextScene = scenes[scenes.length - 1];
	if (prevScene && nextScene.route.routeName === 'StartAssemlbyModal') {
		return {
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			opacity: 1,
		};
	}
	return {
		backgroundColor: constants.colors.white,
		opacity: 1,
	};
};
