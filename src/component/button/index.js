import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Button = ({title, onPress, fixed = false, style}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.center,
        styles.common,
        fixed ? styles.openRecord : {},
        {...style},
      ]}
      onPress={() => onPress()}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
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
  common: {
    borderRadius: 40,
    backgroundColor: '#04BE02',
    width: 80,
    height: 80,
  },
  openRecord: {
    position: 'absolute',
    transform: [{translateX: -40}],
    bottom: 100,
    left: '50%',
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

export default Button;
