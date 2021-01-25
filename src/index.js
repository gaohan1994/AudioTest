import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import moment from 'moment';

import {useMount} from 'ahooks';
import ButtonView from './pages/view';
import AudioPlayModal from './component/audio-play';
import {useDispatch, useSelector} from 'react-redux';
import ConfigApi from './component/config-api';
import CostomerView from './component/costomer-view';

const App = (props) => {
  const [visible, setVisible] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const state = useSelector((state) => state.apiStore);
  const {send, query_url} = state;

  useMount(async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  });

  const queryQuestion = () => {
    return fetch(state.query_url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .catch((error) => {});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <View style={{flex: 1}}>
        <CostomerView queryQuestion={queryQuestion} />
        <View style={styles.container}>
          <View style={styles.content}>
            <Text>数字人App Demo</Text>
            <Text>socket 地址：{send}</Text>
            <Text>请求问题地址：{query_url}</Text>
            <ConfigApi />
          </View>
          <ButtonView
            onClose={(audioFilePath) => {
              if (audioFilePath) {
                setAudioUrl(audioFilePath);
                setVisible(true);
              }
            }}
          />
        </View>
      </View>

      <AudioPlayModal
        visible={visible}
        setVisible={setVisible}
        url={audioUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  openRecord: {
    position: 'absolute',
    transform: [{translateX: -40}],
    bottom: 100,
    left: '50%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#04BE02',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 64,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default App;
