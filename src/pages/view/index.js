import React, {useRef} from 'react';
import Button from '../../component/button';
import {Overlay} from 'teaset';
import AudioRecord from '../../component/audio-record';

export default ({onPress, onRecordData, onClose}) => {
  const overlayRef = useRef(null);
  const AudioOverlay = (
    <Overlay.PullView
      // modal={true}
      side="left"
      style={[{alignItems: 'center', justifyContent: 'center'}]}
      ref={overlayRef}>
      <AudioRecord
        onRecordData={(data) => onRecordData(data)}
        onClose={(data) => {
          onClose(data);
          overlayRef.current?.close();
        }}
      />
    </Overlay.PullView>
  );

  return (
    <Button
      title="通信"
      onPress={() => {
        Overlay.show(AudioOverlay);
      }}
      fixed={true}
    />
  );
};
