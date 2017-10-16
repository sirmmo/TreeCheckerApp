/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
// import LocalizedStrings from 'react-native-localization';
import RNSimpleCompass from 'react-native-simple-compass';
import EditDataForm from '../components/EditDataForm.js';
import { obsUpdate, obsResetForm, obsCreateSaveLocal, obsCreateSaveServer } from '../actions';
import { strings } from './strings.js';
import { CardSection, MyListItem, Card, Header } from '../components/common';

class CreateDataScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Create Data Observation',
    tabBarVisible: false
    // headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  componentDidMount() {
    //console.debug(this.props);
    RNSimpleCompass.start(3, (degree) => {
      console.debug('You are facing', degree);
      RNSimpleCompass.stop();
      this.props.obsUpdate({ prop: 'compass', value: degree })
    });
    console.debug(this.props.position);
  }

  async sendCreateSave() {

    const canopyItem = this.props.canopyList[this.props.canopy_status];
    const crownItem = this.props.crownList[this.props.crown_diameter];
    const treeItem = this.props.treeSpeciesList[this.props.tree_specie];

    const newKey = Date.now();

    await this.props.obsCreateSaveLocal(
      // this.props.navigation,
      // this.props.currentObs,
      newKey,
      this.props.name,
      treeItem, //this.props.tree_specie,
      canopyItem, //this.props.canopy_status,
      crownItem, //this.props.crown_diameter,
      this.props.comment,
      this.props.position,
      this.props.images,
      this.props.currentAoiId
    );

    this.props.obsCreateSaveServer(

      newKey, //this.props.currentObs.key, //this.props.currentObs,
      this.props.currentAoiId,
      this.props.currentGzId,
      this.props.name,
      treeItem, //this.props.tree_specie,
      canopyItem, //this.props.canopy_status,
      crownItem, //this.props.crown_diameter,
      this.props.comment,
      this.props.position,
      this.props.images,
      this.props.compass,

      this.props.token
    );

    // this.props.navigation.goBack('detaildata');
    // this.props.navigation.navigate('listdata');
    this.goBackListData();
  }

  goBackListData() {

    const backAction = NavigationActions.back({
      key: 'listdata'
    })
    this.props.navigation.dispatch(backAction);
    this.props.navigation.goBack(null);
    // this.props.navigation.goBack('detaildata');
  }

  renderButtons() {
    return (
      <View style={styles.rowButtons}>
        <Button
          raised
          iconRight
          large
          backgroundColor='#8BC34A'
          onPress={this.goBackListData.bind(this)}
          icon={{ name: 'close', type: 'font-awesome' }}
          title={strings.cancel} />
        <Button
          raised
          iconRight
          large
          backgroundColor='#8BC34A'
          onPress={this.sendCreateSave.bind(this)}
          icon={{ name: 'save', type: 'font-awesome' }}
          title={strings.save} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerText={strings.addData} icon='edit' />
        <View style={styles.containerForm}>
          <EditDataForm />
        </View>
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
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 25
  },
  containerForm: {
    // minHeight: '35%',
    flex: 4,
    justifyContent: 'center'
  }
});

const mapStateToProps = ({ mapData, obsData, auth, selectFormData, geoZonesData }) => {
  const { canopyList, crownList, treeSpeciesList } = selectFormData;
  const { currentAoiId } = mapData;
  const { currentGzId } = geoZonesData;
  const { token } = auth;
  // const { isConnected } = network;
  const { name, tree_specie, crown_diameter, canopy_status, comment, position, images, isSaving, compass } = obsData;

  return {
    token,
    currentAoiId,
    currentGzId,
    name,
    tree_specie,
    crown_diameter,
    canopy_status,
    comment,
    position,
    images,
    compass,
    isSaving,
    canopyList,
    crownList,
    treeSpeciesList };
};

const myCreateDataScreen = connect(mapStateToProps, {
  obsUpdate,
  obsResetForm,
  obsCreateSaveLocal,
  obsCreateSaveServer
  // obsUpdateSaveLocal
})(CreateDataScreen);

export { myCreateDataScreen as CreateDataScreen };
