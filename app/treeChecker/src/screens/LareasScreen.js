/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';


export default class LareasScreen extends Component {

  // static navigationOptions = {
  //   title: 'User settings',
  //   headerRight: <Button title="Info" onPress={() => navigate('settings', { user: 'Lucy' })} />
  // }

  static navigationOptions = ({ navigation, screenProps }) => ({
      //title: navigation.state.params.name + "'s Profile!",
      //headerRight: <Button color={screenProps.tintColor} {...} />,
      title: 'User settings',
      headerRight: <Button title="Info" onPress={() => navigation.navigate('settings', { user: 'Lucy' })} />
    });

  render() {
    return (
      <View style={styles.container}>
        <Text>Im the LareasScreen component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
