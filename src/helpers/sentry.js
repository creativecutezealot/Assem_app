import * as Sentry from '@sentry/react-native';

export default function() {
	// if (!__DEV__) {
	Sentry.init({
		dsn:
            'https://afd89eeec1f840f0a5bc5fa999b4f1d8@o547831.ingest.sentry.io/5670611',
	});
	// }
}
