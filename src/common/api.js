import {useSelector, useDispatch} from 'react-redux';

// send: 'ws://182.119.128.3:60069/v1/send',
export const API_URL = {
  send: 'ws://test.xfyousheng.com/vclip/v1/send',
  receive: 'ws://test.xfyousheng.com/vclip/v1/receive',
};

// http://182.119.145.103:9080/crsp-ar-dev/queryVoice.ajax
// https://wepay.test.bankcomm.com/crsp-ar-dev/queryVoice.ajax
const initState = {
  send: 'ws://182.119.128.3:60069/v1/send',
  query_url: 'http://182.119.145.103:9080/crsp-ar-dev/queryVoice.ajax',
};

export const Api_Actions = {
  Change_Websocket_Url: 'Change_Websocket_Url',
  Change_Query_Question_Url: 'Change_Query_Question_Url',
};

export function apiStore(state = initState, action) {
  switch (action.type) {
    case Api_Actions.Change_Websocket_Url: {
      return {
        ...state,
        send: action.payload,
      };
    }

    case Api_Actions.Change_Query_Question_Url: {
      return {
        ...state,
        query_url: action.payload,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

export function useApi() {
  const apiState = useSelector((state) => state.apiStore);
  const dispatch = useDispatch();
  const {query_url} = apiState;

  const queryQuestion = () => {
    return fetch(query_url, {
      method: 'GET',
    }).then((res) => res.json());
  };

  const changeWebsocket = (value) => {
    dispatch({
      type: Api_Actions.Change_Websocket_Url,
      payload: value,
    });
  };

  const changeQueryQuestion = (value) => {
    dispatch({
      type: Api_Actions.Change_Query_Question_Url,
      payload: value,
    });
  };

  return {
    state,
    dispatch,
    queryQuestion,
    changeWebsocket,
    changeQueryQuestion,
  };
}

export const api_common = () => {
  return {
    base: {
      appId: 'centerm',
      version: '1.0',
      timeStamp: `${new Date().valueOf()}`,
    },
  };
};
