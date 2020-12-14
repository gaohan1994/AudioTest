[TOC]

# 交行数字人 App

- 项目介绍
- 数字人 app 捕捉用户语音并录制，利用 websocket 技术持续发包给科大讯飞处，科大讯飞经过处理发送给螳螂，螳螂处理数据驱动 ar 发声和修改面部表情

## 一、使用技术

- 项目使用 React-Native react-hooks
- 使用第三方播放组件进行测试 react-native-sound

## 二、项目安装和启动

- svn 地址：[https://github.com/gaohan1994/AudioTest](https://github.com/gaohan1994/AudioTest)
- 安装：`npm i`、`npm install`或者`yarn`
- 安装依赖包（如果启动报错尝试执行该步骤） `npx react-native link`
- 启动：`npm run start`或者`yarn start`

## 三、项目文件结构

```javascript
|-- ios // ios运行需要的相关代码
|-- android // android运行需要的相关代码
|-- src
  |-- asset // 静态资源
  |-- common // 公用类和工具
    |-- socket.js // 封装好的websocket js
  |-- component // 组件库
    |-- audio-play //播放语音流组件
    |-- audio-record //录音组件
  |-- pages // 页面文件集合
  |-- index.js // 入口文件
```

## 四、项目总结

### 4.1 websocket

- rn 官方提供 websocket 库，使用的时候最好经过一层封装再进行使用下面给出两种版本的封装，个人更推荐单例模式的封装性能不浪费

* 单例模式封装

```
import {DeviceEventEmitter} from 'react-native';
import {API_URL} from './api';
const url = API_URL.send;

let that = null;

export default class WebSocketClient {
  constructor() {
    this.ws = null;
    that = this;
  }

  /**
   * 获取WebSocket单例
   * @returns {WebSocketClient}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketClient();
    }
    return this.instance;
  }

  /**
   * 初始化WebSocket
   */
  initWebSocket() {
    try {
      //timer为发送心跳的计时器
      this.timer && clearInterval(this.timer);
      this.ws = new WebSocket(url);
      console.log('this.ws', this.ws);
      this.initWsEvent();
    } catch (e) {
      console.log('WebSocket err:', e);
      //重连
      this.reconnect();
    }
  }

  /**
   * 初始化WebSocket相关事件
   */
  initWsEvent() {
    console.log('initWsEvent,', this.ws);
    //建立WebSocket连接
    this.ws.onopen = function () {
      console.log('WebSocket:', 'connect to server');
    };

    //客户端接收服务端数据时触发
    this.ws.onmessage = function (evt) {
      if (evt.data !== 'pong') {
        //不是心跳消息，消息处理逻辑
        console.log('WebSocket: response msg', evt.data);
        //接收到消息，处理逻辑...
        //更新广播
        DeviceEventEmitter.emit('pushEmitter', '');
      } else {
        console.log('WebSocket: response pong msg=', evt.data);
      }
    };
    //连接错误
    this.ws.onerror = function (err) {
      console.log('WebSocket:', 'connect to server error');
      //重连
      that.reconnect();
    };
    //连接关闭
    this.ws.onclose = function () {
      console.log('WebSocket:', 'connect close');
      //重连
      that.reconnect();
    };

    //每隔15s向服务器发送一次心跳
    this.timer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket:', 'ping');
        this.ws.sendMessage('ping');
      }
    }, 15000);
  }

  //发送消息
  sendMessage(msg) {
    console.log('this.ws.readyState ', this.ws.readyState);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(msg);
      } catch (err) {
        console.warn('ws sendMessage', err.message);
      }
    } else {
      console.log('WebSocket:', 'connect not open to send message');
    }
  }

  //重连
  reconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function () {
      //重新连接WebSocket
      this.initWebSocket();
    }, 15000);
  }
}

```

- 简单封装

```
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

```
