import React from 'react';
import Modal from 'react-native-modal';
import {View, Text} from 'react-native';
import {Button} from 'react-native-centerm-sdk';
import Sound from 'react-native-sound';
import {Toast} from 'teaset';

export default (props) => {
  const {visible, setVisible, url} = props;

  const onPlayAudio = () => {
    console.log('url', url);
    const sound = new Sound(url, '', (error) => {
      if (error) {
        console.log('sound error:', error);
      }

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            Toast.success('播放完毕！');
            setVisible(false);
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    });
  };

  return (
    <Modal isVisible={visible} onBackButtonPress={() => setVisible(false)}>
      <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10}}>
        <Text>是否播放刚才通信的录音？</Text>

        <View
          style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            size="normal"
            style={{marginRight: 10}}
            title="取消"
            onPress={() => setVisible(false)}
          />
          <Button size="normal" title="播放" onPress={() => onPlayAudio()} />
        </View>
      </View>
    </Modal>
  );
};
