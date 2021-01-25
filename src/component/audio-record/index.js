/**
 * 组件测试
 * @Author: centerm.gaohan
 * @Date: 2020-10-23 14:45:23
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2021-01-21 17:05:19
 */
import React, {useState, useRef} from 'react';
import {useMount} from 'ahooks';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {Toast} from 'teaset';
import {ScreenUtil} from 'react-native-centerm-sdk';
import Button from '../button';
import CostomerView from '../costomer-view';
import Websocket from '../../common/socket';
import {api_common} from '../../common/api';
import {useSelector} from 'react-redux';

const AudioStatus = {
  record: 'record',
  stop: 'stop',
};

const SocketStatus = {
  open: 'open',
  error: 'error',
  close: 'close',
};

const Audio = (props) => {
  const websocketRef = useRef(null);
  /**
   * @param {onRecordData} 监控数据
   */
  const {onClose} = props;
  // options
  const [option, setOption] = useState({});
  // 当前录音状态 record stop
  const [recordStatus, setRecordStatus] = useState('');
  // socket的状态
  const [socketStatus, setSocketStatus] = useState(SocketStatus.close);

  const state = useSelector((state) => state.apiStore);
  console.log('[state]', state);

  const queryQuestion = () => {
    return fetch(state.query_url, {
      method: 'GET',
    }).then((res) => res.json());
  };

  const onRecordData = (data) => {
    const payload = {
      ...api_common(),
      // base: {
      //   appId: 'centerm',
      //   version: '1.0',
      //   timeStamp: `${new Date().valueOf()}`,
      // },
      token: 'token',
      last: false,
      vcn: 'xiaoyuan',
      spd: 50,
      vol: 50,
      type: 0,
      data: data,
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    websocketRef.current?.send(payload);
  };

  // 校验是否有权限
  // 进入的时候开启
  useMount(() => {
    const options = {
      sampleRate: 16000, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: 'test.wav', // default 'audio.wav'
    };
    AudioRecord.init(options);
    setOption(options);

    /**
     * 捕捉用户输入的语音之后调用外部接口
     */
    AudioRecord.on('data', (data) => {
      if (onRecordData) {
        onRecordData(data);
        // setSocketTimes((prevTimes) => prevTimes + 1);
      }
    });
  });

  // 开始录音
  const onRecord = () => {
    setRecordStatus(AudioStatus.record);
    AudioRecord.start();
  };

  // 停止录音
  const onStop = async () => {
    setRecordStatus(AudioStatus.stop);
    const filePath = await AudioRecord.stop();
    onClose(filePath);
  };

  const buttons = [
    {
      title: '静音',
      style: {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
    },
    {
      title: '挂断',
      style: {backgroundColor: 'red'},
      onPress: () => {
        Toast.info('通信结束');
        onStop();
      },
    },
    {
      title: '免提',
      style: {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
    },
  ];

  // 开始录音
  const onSocketOpen = () => {
    Toast.info('socket连接成功');
    setSocketStatus(SocketStatus.open);
    onRecord();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />

      <View style={styles.content}>
        <Text style={[styles.text, {marginTop: 10, marginBottom: 5}]}>
          {socketStatus === SocketStatus.open
            ? 'socket已连接'
            : socketStatus === SocketStatus.error
            ? 'socket报错'
            : socketStatus === SocketStatus.close
            ? 'socket未关闭'
            : ''}
          {recordStatus === AudioStatus.record ? '  正在录音' : '  录音未开始'}
        </Text>
      </View>
      <CostomerView queryQuestion={queryQuestion} />

      <View style={styles.buttons}>
        {buttons.map((item) => {
          const {title, onPress, ...rest} = item;
          return (
            <Button
              key={title}
              {...rest}
              title={title}
              onPress={onPress ? onPress : () => {}}
            />
          );
        })}
      </View>

      <Websocket
        reconnect={true}
        ref={websocketRef}
        url={state.send}
        onOpen={(data) => {
          onSocketOpen();
        }}
        onClose={() => {
          Toast.sad('socket 已关闭');
          console.log('onclose');
        }}
        onError={(error) => {
          Toast.sad('socket 报错');
          console.log('error: ', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
  buttons: {
    width: ScreenUtil.screenWidth,
    position: 'absolute',
    height: 80,
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    width: ScreenUtil.screenWidth,
    flexDirection: 'column',
    paddingTop: 64,
    paddingLeft: 20,
    paddingRight: 20,
  },
  img: {
    width: ScreenUtil.screenWidth / 3,
    height: ScreenUtil.screenWidth / 3,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
});
export default Audio;
