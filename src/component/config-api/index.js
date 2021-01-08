import React, {useRef, useEffect, useState} from 'react';
import {Input} from 'teaset';
import Modal from 'react-native-modal';
import {Button, ScreenUtil} from 'react-native-centerm-sdk';
import {View, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Api_Actions} from '../../common/api';
import Toast from 'teaset/components/Toast/Toast';

function ConfigApi() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.apiStore);

  const [visible, setVisible] = useState(false);
  const [currentSend, setCurrentSend] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

  /**
   * 初始化接口信息
   */
  useEffect(() => {
    setCurrentSend(state.send);
    setCurrentQuery(state.query_url);
  }, [state]);

  // 修改socket地址
  const changeWebsocket = (value) => {
    dispatch({
      type: Api_Actions.Change_Websocket_Url,
      payload: value,
    });
  };

  // 修改query地址
  const changeQueryQuestion = (value) => {
    dispatch({
      type: Api_Actions.Change_Query_Question_Url,
      payload: value,
    });
  };

  // 提交
  const onSubmit = () => {
    changeWebsocket(currentSend);
    changeQueryQuestion(currentQuery);
    Toast.info('配置接口信息成功！');
    setVisible(false);
  };

  return (
    <View>
      <Button
        title="配置接口地址"
        size="small"
        style={{marginTop: 10}}
        onPress={() => {
          setVisible(true);
        }}
      />
      <Modal isVisible={visible}>
        <View style={styles.container}>
          <Text style={[styles.title, {marginBottom: 20}]}>
            配置接口相关地址
          </Text>
          <View style={styles.item}>
            <Text style={styles.title}>socket地址：</Text>
            <Input value={currentSend} onChangeText={setCurrentSend} />
          </View>

          <View style={[styles.item, {marginTop: 20}]}>
            <Text style={styles.title}>请求问题地址：</Text>
            <Input value={currentQuery} onChangeText={setCurrentQuery} />
          </View>

          <Button
            style={{marginTop: 30}}
            title="确定"
            size="normal"
            onPress={onSubmit}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ScreenUtil.screenHeith * 0.5,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  item: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    marginBottom: 5,
    marginLeft: 5,
  },
};

export default ConfigApi;
