import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ScreenUtil} from 'react-native-centerm-sdk';
import {merge} from 'lodash';
import moment from 'moment';

class CostomerView extends React.Component {
  constructor(props) {
    super(props);
    this.timer;
    this.state = {
      renderQuestionList: [],
    };
  }
  componentDidMount() {
    // const timerId = setInterval(() => {
    //   this.fetchList();
    // }, 0.5 * 1000);

    // this.timer = timerId;
    this.fetchList();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchList = () => {
    const {queryQuestion} = this.props;

    console.log('[开始时间]:', moment().format('HH:mm:ss'));
    if (queryQuestion) {
      queryQuestion()
        .then((result) => {
          console.log('[请求问题结果result]:', result);
          const {RSP_BODY} = result;
          const {question, responseMessage} = RSP_BODY;

          // 异常
          if (!result) {
            return;
          }

          // 超时重新请求
          if (responseMessage === '获取超时') {
            this.fetchList();
            return;
          }

          // 有数据
          const {renderQuestionList} = this.state;
          if (question) {
            let nextQuestionList = merge([], renderQuestionList);
            nextQuestionList = nextQuestionList.concat(question);
            this.setState({renderQuestionList: nextQuestionList});
          }
          // 长轮训如果有数据了之后立马发送下一个请求
          this.fetchList();
        })
        .catch((error) => {
          // 如果报错或者超时则重新请求
          console.log('[报错时间]:', moment().format('HH:mm:ss'));
          console.log('[请求问题报错error]:', error);
          // this.fetchList();
        });
    }
  };

  render() {
    const {renderQuestionList} = this.state;
    return (
      <View style={styles.content}>
        <Text style={[styles.text, {marginBottom: 5, marginLeft: 20}]}>
          用户提问信息
        </Text>
        <ScrollView style={styles.list}>
          <View>
            {renderQuestionList && renderQuestionList.length > 0 ? (
              renderQuestionList.map((item, index) => {
                return (
                  <Text key={index} style={styles.text}>
                    {item}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.text}>暂无问题</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default CostomerView;

export const styles = StyleSheet.create({
  list: {
    width: ScreenUtil.screenWidth,
    maxHeight: ScreenUtil.screenHeith * 0.6,
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    position: 'relative',
    flex: 1,
    width: ScreenUtil.screenWidth,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingTop: 64,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
});
