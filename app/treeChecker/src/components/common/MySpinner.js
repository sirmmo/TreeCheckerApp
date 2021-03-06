import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-spinkit';

const MySpinner = ({ type, color }) => {
  return (
    <View style={styles.spinnerStyle}>
      <Spinner name={type || 'wave'} color={color || '#8BC34A'}/>
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  }
};

export { MySpinner };
