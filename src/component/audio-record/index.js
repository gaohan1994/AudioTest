/**
 * 组件测试
 * @Author: centerm.gaohan
 * @Date: 2020-10-23 14:45:23
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-11-09 11:08:23
 */
import React, {useEffect, useState} from 'react';
import {useMount} from 'ahooks';
import {View, Text, StyleSheet} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {Toast, Overlay} from 'teaset';

const AudioStatus = {
  record: 'record',
  stop: 'stop',
};

const Audio = (props) => {
  /**
   * @param {onRecordData} 监控数据
   */
  const {onRecordData} = props;
  // 当前录音状态 record stop
  const [recordStatus, setRecordStatus] = useState('');

  // 校验是否有权限
  useMount(() => {
    const options = {
      sampleRate: 16000, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: 'test.wav', // default 'audio.wav'
    };
    AudioRecord.init(options);

    /**
     * 捕捉用户输入的语音之后调用外部接口
     */
    AudioRecord.on('data', (data) => {
      if (onRecordData) {
        console.log('data', data);
        // onRecordData(data);
      }
    });
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

  console.log(
    'recordStatus !== AudioStatus.record',
    recordStatus !== AudioStatus.record,
  );
  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={
          recordStatus !== AudioStatus.record
            ? onRecord
            : () => {
                Toast.fail('正在录音');
              }
        }>
        Record(开始录音)
      </Text>
      <Text style={styles.text} onPress={onStop}>
        Stop(停止录音)
      </Text>
      <Text style={styles.text}>
        {recordStatus === AudioStatus.record ? '正在录音' : '未开始'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
export default Audio;
