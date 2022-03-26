import { requireNativeComponent, Platform } from 'react-native';

export const NATIVE_COMPONENT = 'AudioDeviceSelect';

const AudioDeviceSelectManager =
    Platform.OS === 'ios' ? requireNativeComponent(NATIVE_COMPONENT) : null;

export default AudioDeviceSelectManager;
