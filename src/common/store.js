import {combineReducers, createStore} from 'redux';
import {apiStore} from './api';

export const reducers = combineReducers({
  apiStore,
});
