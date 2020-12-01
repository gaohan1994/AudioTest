import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useMount} from 'ahooks';
import AudioRecord from './component/audio-record';
import Websocket from './common/socket';
import {API_URL, api_common} from './common/api';
import {Overlay} from 'teaset';
// import Button from './component/button';
import ButtonView from './pages/view';
import AudioPlayModal from './component/audio-play';
import Toast from 'teaset/components/Toast/Toast';
import Modal from 'react-native-modal';
// import WebsocketDM from './common/socket-t';

const App = () => {
  const websocketRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  useMount(async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  });

  const onRecordData = (data) => {
    const payload = {
      ...api_common(),
      token: 'token',
      last: false,
      vcn: 'xiaozhang',
      spd: 50,
      vol: 50,
      data: data,
      type: 0,
    };
    // const payloadString = JSON.stringify(payload);
    console.log('payload', payload);
    // const client = WebsocketDM.getInstance();
    // console.log('client', client);
    // client?.sendMessage(payloadString);
    // console.log(payloadString);
    // console.log('websocketRef.current', websocketRef.current);
    websocketRef.current?.send(payload);
  };

  const onopen = (event) => {
    console.log('onopen');
    Toast.info('socket 已连接');
  };

  const onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('message data', data);
  };

  // const AudioOverlay = (
  //   <Overlay.PullView
  //     // modal={true}
  //     side="left"
  //     style={[{alignItems: 'center', justifyContent: 'center'}]}
  //     ref={overlayRef}>
  //     <AudioRecord
  //       onRecordData={(data) => onRecordData(data)}
  //       onClose={(audioFilePath) => {
  //         if (audioFilePath) {
  //           // console.log('audioFilePath', typeof audioFilePath);
  //           // console.log('audioFilePath', audioFilePath);
  //           setAudioUrl(audioFilePath);
  //           setVisible(true);
  //         }
  //         overlayRef.current?.close();
  //       }}
  //     />
  //   </Overlay.PullView>
  // );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <View>
            <Text>数字人App Demo</Text>
          </View>
          <ButtonView
            onRecordData={(data) => onRecordData(data)}
            onClose={(audioFilePath) => {
              if (audioFilePath) {
                // console.log('audioFilePath', typeof audioFilePath);
                // console.log('audioFilePath', audioFilePath);
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
      <Websocket
        reconnect={true}
        ref={websocketRef}
        url={API_URL.send}
        onOpen={(data) => {
          console.log('onopen');
          onopen(data);
        }}
        onMessage={(data) => {
          console.log('onmessage');
          onmessage(data);
        }}
        onClose={() => {
          Toast.sad('socket 已关闭');
          console.log('onclose');
        }}
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
});

export default App;
