/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-04-08 11:09:02
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-12-14 10:13:51
 *
 * @todo 封装的websocket
 */

import React from 'react';

class WS extends React.PureComponent {
  static defaultProps = {
    reconnect: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ws: undefined,
    };
    this.reconnect = false;
  }

  send = (data) => {
    console.log('[socket data]: ', data);
    console.log('this.state.ws.readyState', this.state.ws.readyState);
    if (this.state.ws && this.state.ws.readyState === WebSocket.OPEN) {
      if (typeof data === 'string') {
        this.state.ws.send(data);
      } else {
        this.state.ws.send(JSON.stringify(data));
      }
    }
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.reconnect = !!this.props.reconnect;
    this._handleWebSocketSetup();
  }

  // componentWillUnmount() {
  //   this.reconnect = false;

  //   if (this.state.ws) {
  //     this.state.ws.close();
  //   }
  // }

  render() {
    return null;
  }

  _handleWebSocketSetup = () => {
    if (this.state.ws && this.state.ws.readyState === 1) {
      return;
    }
    const ws = new WebSocket(this.props.url);
    ws.onopen = (data) => {
      if (this.props.onOpen) {
        this.props.onOpen(data);
      }
    };
    ws.onmessage = (event) => {
      if (this.props.onMessage) {
        this.props.onMessage(event);
      }
    };
    ws.onerror = (error) => {
      console.log('onerror', error);
      console.log('error message ', error.message);
      if (this.props.onError) {
        this.props.onError(error);
      }
    };
    ws.onclose = (data) => {
      if (this.reconnect) {
        console.log('this.reconnect', this.reconnect);
        this._handleWebSocketSetup();
      } else {
        this.props.onClose && this.props.onClose(data);
      }
    };

    //每隔15s向服务器发送一次心跳
    // this.timer = setInterval(() => {
    //   if (ws && ws.readyState === WebSocket.OPEN) {
    //     console.log('WebSocket:', 'ping');
    //     this.send('ping');
    //   }
    // }, 5000);

    this.setState({ws});
  };
}

export default WS;
