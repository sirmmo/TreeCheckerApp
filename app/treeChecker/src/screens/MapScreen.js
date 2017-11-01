/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview-messaging/WebView';
import { connect } from 'react-redux';
import {  setUrlMapOffline, obsCreate, refreshSelectedAoiByIndex } from '../actions';

class MapScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'MAP',
    headerRight: <Button icon={{name: 'menu'}} onPress={() => console.log('onPress Menu')} />,
    //tabBarVisible: false,
    // tabBarIcon: <Icon name='map' size={24} />,
    // titleStyle: {
    //   color: '#FFFF00'
    // }
  });

  componentDidMount() {
    console.debug('------------------------------------------componentDidMount');
    if (this.props.navigation.state.params && this.props.navigation.state.params.action
        && this.props.navigation.state.params.action === 'goTo') {

      this.goto = {
        latitude: this.props.navigation.state.params.latitude,
        longitude: this.props.navigation.state.params.longitude
      };

    } else {
      this.initServer();
    }

    const { messagesChannel } = this.webview;
    messagesChannel.on('json', json => {
      console.debug(json);
      this.processMapAction(json);
    });

    // messagesChannel.on('text', text => {
    //   console.debug('text', text);
    // });
  }

  processMapAction(json) {

    switch (json.action) {

      case 'addObservation':
        const pos = {
          latitude: json.latitude,
          longitude: json.longitude
        };
        //console.debug('this.props.currentAoi.obs.length', this.props.currentAoi.obs.length);
        this.props.obsCreate(pos, Object.keys(this.props.currentAoi.obs).length+1);
        this.props.navigation.navigate('createdata');
        return;

      case 'info':
        this.props.refreshSelectedAoiByIndex(json.id);
        this.props.navigation.navigate('detaildata', { originScreen: 'mapscreen' })
        return;

      case 'webInit':
        if(this.goto) {
          this.initMapaByCenter(this.goto, this.props.currentAoi.obs, this.offlineURL );
        }
        else {
          this.initMapaByBbox(this.props.currentAoi.bbox, this.props.currentAoi.obs, this.offlineURL);
        }
        this.goto = null;
        return;

      default:
        return console.debug('action del mapa no controlada: ', json);
    }
  }

  initMapaByBbox(bbox, obs, url) {

    this.webview.sendJSON({ bbox, obs, url });

  }

  initMapaByCenter(point, obs, url) {

    this.webview.sendJSON({ latitude: point.latitude, longitude:point.longitude, obs, url });

  }

  initServer() {
    console.debug(RNFS.ExternalDirectoryPath);
    const myserver = new StaticServer(8080, RNFS.ExternalDirectoryPath);
    console.debug(myserver);
    // Start the server
    myserver.start().then((url) => {

      this.offlineURL = url;

    });
  }

  stopServer(){
    this.props.server.stop();
  }

  _refWebView = (webview) => {
    this.webview = webview;
  }

  render() {
    const { selectedTab } = 'profile';
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: 'file:///android_asset/web/baseMap.html' }}
          ref={this._refWebView}
          style={{ flex: 1, borderBottomWidth: 1, padding: 20 }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = ({ auth, mapData }) => {
  //const { currentAoiList } = geoZonesData;
  const { token } = auth;
  const { currentAoi } = mapData;
  return { token, currentAoi };
};

const myMapScreen = connect(mapStateToProps, {
  setUrlMapOffline,
  obsCreate,
  refreshSelectedAoiByIndex
})(MapScreen);

export { myMapScreen as MapScreen };
