/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-04-08 11:09:02
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-30 14:21:42
 *
 * @todo 封装的websocket
 */

import React from 'react';

class WS extends React.Component {
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

    if (this.state.ws && this.state.ws.readyState === WebSocket.OPEN) {
      if (typeof data === 'string') {
        this.state.ws.send(data);
      } else {
        this.state.ws.send(JSON.stringify(data));
      }
    }
  };

  componentDidMount() {
    this.reconnect = !!this.props.reconnect;
    this._handleWebSocketSetup();
  }

  componentWillUnmount() {
    this.reconnect = false;

    if (this.state.ws) {
      this.state.ws.close();
    }
  }

  render() {
    return null;
  }

  _handleWebSocketSetup = () => {
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
      if (this.props.onError) {
        this.props.onError(error);
      }
    };
    ws.onclose = (data) =>
      this.reconnect
        ? this._handleWebSocketSetup()
        : this.props.onClose && this.props.onClose(data);
    this.setState({ws});
  };
}

export default WS;
