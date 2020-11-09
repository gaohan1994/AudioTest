import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AudioRecord from './component/audio-record';
import Websocket from './common/socket';
import {API_URL, api_common} from './common/api';
import {Overlay} from 'teaset';

const App = () => {
  const websocketRef = useRef(null);
  const overlayRef = useRef(null);

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
    console.log('payload', payload);
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

  const Button = ({title, onPress, style}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.center, styles.openRecord, {...style}]}
        onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  };
  const AudioOverlay = (
    <Overlay.PullView style={styles.center} ref={overlayRef}>
      <View style={styles.overlay}>
        <AudioRecord onRecordData={onRecordData} />
        <Button
          title="挂断"
          style={{backgroundColor: 'red'}}
          onPress={() => {
            // Overlay.show(AudioOverlay);
            overlayRef.current?.close();
          }}
        />
      </View>
    </Overlay.PullView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Button
            title="通信"
            onPress={() => {
              Overlay.show(AudioOverlay);
            }}
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
