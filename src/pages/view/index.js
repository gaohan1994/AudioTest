import React, {useRef} from 'react';
import Button from '../../component/button';
import {Overlay} from 'teaset';
import AudioRecord from '../../component/audio-record';

export default ({onClose, children}) => {
  const overlayRef = useRef(null);
  const AudioOverlay = (
    <Overlay.PullView
      side="left"
      style={[{alignItems: 'center', justifyContent: 'center'}]}
      ref={overlayRef}>
      <AudioRecord
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
