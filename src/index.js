import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {useMount} from 'ahooks';
import AudioRecord from './component/audio-record';
import Websocket from './common/socket';
import {API_URL, api_common} from './common/api';
import {Overlay} from 'teaset';
import Button from './component/button';

const App = () => {
  const websocketRef = useRef(null);
  const overlayRef = useRef(null);

  useMount(async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  });

  const onRecordData = (data) => {
    const payload = {
      ...api_common(),
      token: 'token',
      last: true,
      vcn: 'Gh',
      spd: 50,
      vol: 50,
      data: data,
      type: 0,
    };
    // console.log('payload', payload);
    websocketRef.current?.send(payload);
  };

  const onopen = (event) => {
    console.log('onopen');
    console.log('event', event);
  };

  const onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('message data', data);
  };

  const AudioOverlay = (
    <Overlay.PullView
      // modal={true}
      side="left"
      style={[{alignItems: 'center', justifyContent: 'center'}]}
      ref={overlayRef}>
      <AudioRecord
        onRecordData={onRecordData}
        onClose={() => {
          overlayRef.current?.close();
        }}
      />
    </Overlay.PullView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <View>
            <Text>数字人App Demo</Text>
          </View>
          <Button
            title="通信"
            onPress={() => {
              console.log('hello');
              Overlay.show(AudioOverlay);
            }}
            fixed={true}
          />
        </View>
      </View>

      <Websocket
        ref={websocketRef}
        url={API_URL.send}
        onOpen={onopen}
        onMessage={onmessage}
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
