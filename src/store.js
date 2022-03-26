import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import applyAppStateListener from 'redux-enhancer-react-native-appstate';
import IndexSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	compose(
		applyAppStateListener(),
		applyMiddleware(sagaMiddleware)
	)
);
sagaMiddleware.run(IndexSaga);

export default store;