/* @flow */

import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Grid, Col, Row, Button } from 'react-native-elements';
import { WebView } from 'react-native-webview-messaging/WebView';
import RNFS from 'react-native-fs';
import StaticServer from 'react-native-static-server';
import { NavigationActions } from 'react-navigation';

import { strings } from './strings.js';
import EditDataForm from '../components/EditDataForm.js';
import { obsUpdate, obsUpdateSaveServer, obsUpdateSaveLocal } from '../actions';
import { CardSection, MyListItem, Card, Header, MySpinner } from '../components/common';


class EditDataScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Edit Data Observation',
    tabBarVisible: false
    // headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  componentWillMount() {
    _.each(this.props.currentObs, (value, prop) => {
      if (prop.includes('_')) {
        this.props.obsUpdate({ prop, value: value.key });
      } else {
        this.props.obsUpdate({ prop, value });
      }
    });
  }

  componentDidMount() {

    this.isInitialized = false;
    this.subscribeMessages();
    this.initServer();

  }

  receiveServerData(json) {

    if(json.webInit) {

      this.sendInitParams();
      this.isInitialized = true;

    } else if(this.isInitialized) {

      this.props.obsUpdate({ prop: 'position', value: { latitude: json.center.lat, longitude: json.center.lng } });

    }

  }

  sendInitParams() {

    const {position} = this.props;

    this.webview.sendJSON({ pos: position });
    console.log("--------- Send init params: " + JSON.stringify(position));

  }

  setWebView(webview) {

    this.webview = webview;

  }

  subscribeMessages() {

    const { messagesChannel } = this.webview;
    messagesChannel.on('json', (json) => this.receiveServerData(json) );

  }

  initServer() {
    const myserver = new StaticServer(8080, RNFS.ExternalDirectoryPath);
    // Start the server
    myserver.start().then((url) => {

      console.debug('Serving at URL' + url);
      this.webview.sendJSON({ urlOffline: url });

    });
  }

  goBackDetailData() {
    // const resetAction = NavigationActions.reset({
    //   index: 1,
    //   actions: [
    //     //NavigationActions.navigate({ routeName: 'mainflow' }),
    //     NavigationActions.navigate({ routeName: 'mapflow' }),
    //     NavigationActions.navigate({ routeName: 'detaildata' })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);

    const backAction = NavigationActions.back({
      key: 'detaildata'
    })
    this.props.navigation.dispatch(backAction);
    this.props.navigation.goBack(null);
    // this.props.navigation.goBack('detaildata');
  }

  async sendUpdateSave() {

    const canopyItem = this.props.canopyList[this.props.canopy_status];
    const crownItem = this.props.crownList[this.props.crown_diameter];
    const treeItem = this.props.treeSpeciesList[this.props.tree_specie];

    await this.props.obsUpdateSaveLocal(
      // this.props.navigation,
      this.props.currentObs,
      this.props.currentAoiId,
      this.props.name,
      treeItem, //this.props.tree_specie,
      canopyItem, //this.props.canopy_status,
      crownItem, //this.props.crown_diameter,
      this.props.comment,
      this.props.position,
      this.props.images
    );
    //console.debug('res await save local', res);

    await this.props.obsUpdateSaveServer(

      this.props.currentObs.key, //this.props.currentObs,
      this.props.currentAoiId,
      this.props.currentGzId,
      this.props.name,
      treeItem, //this.props.tree_specie,
      canopyItem, //this.props.canopy_status,
      crownItem, //this.props.crown_diameter,
      this.props.comment,
      this.props.position,
      this.props.images,
      this.props.currentObs.compass,

      this.props.token
    );
    // this.props.navigation.goBack('detaildata');
    this.goBackDetailData();
    // this.props.navigation.navigate('detaildata');
  }

  renderButtons() {
    console.debug('this.props.navigation', this.props.navigation);
    const { goBack } = this.props.navigation;
    const size = 100;
    if (this.props.isSaving) {
      return(
        <MySpinner type='ThreeBounce' color='#FFFFFF' />
      );
    }

    return (
      <View style={styles.rowButtons}>
        <Button
          raised
          iconRight
          onPress={this.goBackDetailData.bind(this)}
          icon={{ name: 'close', type: 'font-awesome' }}
          title={strings.cancel} />
        <Button
          raised
          iconRight
          backgroundColor='#8BC34A'
          onPress={this.sendUpdateSave.bind(this)}
          icon={{ name: 'save', type: 'font-awesome' }}
          title={strings.save} />
      </View>
    );
  }

  renderMap() {
    console.debug('rendermap');
    return (
      <View style={styles.containerMap}>
        <CardSection style={{backgroundColor: '#C8E6C9'}}>
        <Text>{strings.moveMap}</Text>
        </CardSection>
        <WebView
          source={require('./resources/web/centerPin.html')}
          ref={ (webview) => { this.setWebView(webview); } }
          style={{ flex: 1, borderBottomWidth: 1, padding: 20 }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerText={strings.editData} icon='edit' />
        <View style={styles.containerForm}>
          <EditDataForm />
        </View>

        {this.renderMap()}


        <View style={styles.containerButtons}>
          {this.renderButtons()}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  containerButtons: {
    paddingTop: 15,
    flex: 1,
    //minHeight: '15%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  containerMap: {
    width: '100%',
    margin: 5,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flex: 2,
    justifyContent: 'center'
  },
  containerForm: {

    flex: 4,
    justifyContent: 'center'
  },
  spinner: {
    marginBottom: 50
  }
});

const mapStateToProps = ({ mapData, obsData, auth, selectFormData, geoZonesData }) => {
  const { canopyList, crownList, treeSpeciesList } = selectFormData;
  const { currentObs, currentAoiId } = mapData;
  const { currentGzId } = geoZonesData;
  const { token } = auth;
  // const { isConnected } = network;
  const { name, tree_specie, crown_diameter, canopy_status, comment, position, images, isSaving } = obsData;

  return {
    token,
    currentObs,
    currentAoiId,
    currentGzId,
    name,
    tree_specie,
    crown_diameter,
    canopy_status,
    comment,
    position,
    images,
    isSaving,
    canopyList,
    crownList,
    treeSpeciesList };
};

const myEditDataScreen = connect(mapStateToProps, {
  obsUpdate,
  obsUpdateSaveServer,
  obsUpdateSaveLocal
})(EditDataScreen);

export { myEditDataScreen as EditDataScreen };
