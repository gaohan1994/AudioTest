import React from 'react';
import {Provider} from 'react-redux';
import App from './index';
import {createStore} from 'redux';
import {reducers} from './common/store';
import {TopView} from 'teaset';

const Index = () => {
  const store = createStore(reducers);
  return (
    <Provider store={store}>
      <TopView>
        <App />
      </TopView>
    </Provider>
  );
};

export {Index};
export default Index;
