import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {queryQuestion} from '../../common/api';
import {ScreenUtil} from 'react-native-centerm-sdk';
import {merge} from 'lodash';

class CostomerView extends React.Component {
  constructor(props) {
    super(props);
    this.timer;
    this.state = {
      renderQuestionList: [],
    };
  }
  componentDidMount() {
    const timerId = setInterval(() => {
      this.fetchList();
    }, 3 * 1000);

    this.timer = timerId;
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchList = () => {
    queryQuestion().then((result) => {
      const {RSP_BODY} = result;
      const {question} = RSP_BODY;
      const {renderQuestionList} = this.state;
      if (question) {
        let nextQuestionList = merge([], renderQuestionList);
        nextQuestionList = nextQuestionList.concat(question);
        this.setState({renderQuestionList: nextQuestionList});
      }
    });
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
                    {index}
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
    paddingTop: 64,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
});
