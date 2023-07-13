import { legacy_createStore as createStore, combineReducers,applyMiddleware } from 'redux';
import searchReducer from './reducers/searchReducer';
import gridCardReducer from './reducers/gridCardReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  search: searchReducer,
  gridCard: gridCardReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
