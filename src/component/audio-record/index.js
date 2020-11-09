/**
 * 组件测试
 * @Author: centerm.gaohan
 * @Date: 2020-10-23 14:45:23
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-11-09 14:28:02
 */
import React, {useEffect, useState} from 'react';
import {useMount} from 'ahooks';
import {View, Text, StyleSheet, Image} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {Toast} from 'teaset';
import {ScreenUtil} from 'react-native-centerm-sdk';
import Button from '../button';
import iconboc from '../../asset/boc.jpeg';

const AudioStatus = {
  record: 'record',
  stop: 'stop',
};

const Audio = (props) => {
  /**
   * @param {onRecordData} 监控数据
   */
  const {onRecordData, onClose} = props;
  // options
  const [option, setOption] = useState({});
  // 当前录音状态 record stop
  const [recordStatus, setRecordStatus] = useState('');
  // 通话时长
  const [] = useState('');
  // 通讯次数
  const [socketTimes, setSocketTimes] = useState(0);

  // 校验是否有权限
  // 进入的时候开启
  useMount(() => {
    console.log('1');
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
        // onRecordData(data);

        setSocketTimes((prevTimes) => prevTimes + 1);
      }
    });

    onRecord();
  });

  // 开始录音
  const onRecord = () => {
    console.log('setRecordStatus');
    setRecordStatus(AudioStatus.record);
    AudioRecord.start();
  };

  // 停止录音
  const onStop = async () => {
    setRecordStatus(AudioStatus.stop);
    const filePath = await AudioRecord.stop();
    console.log('filePath', filePath);
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
        onClose();
      },
    },
    {
      title: '免提',
      style: {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={iconboc} style={styles.img} />
        <Text style={styles.name}>升腾 数字人</Text>

        <Text style={[styles.text, {marginTop: 10, marginBottom: 5}]}>
          测试信息
        </Text>
        <Text style={styles.text}>
          {recordStatus === AudioStatus.record ? '正在录音' : '未开始'}
        </Text>
        <Text style={styles.text}>采样器：{option.sampleRate}</Text>
        <Text style={styles.text}>位采样：{option.bitsPerSample}</Text>
        <Text style={styles.text}>文件名：{option.wavFile}</Text>
        <Text style={styles.text}>通讯次数：{socketTimes}</Text>
      </View>

      <View style={styles.buttons}>
        {buttons.map((item) => {
          const {title, onPress, ...rest} = item;
          return (
            <Button
              {...rest}
              title={title}
              onPress={onPress ? onPress : () => {}}
            />
          );
        })}
      </View>
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
    fontSize: 12,
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
    flex: 1,
    width: ScreenUtil.screenWidth,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 100,
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
