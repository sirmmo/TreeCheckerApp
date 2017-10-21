/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Toast from 'react-native-toast-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { strings } from './strings.js';
import { refreshSelectedObs, obsUpdateSaveServer } from '../actions';
import { CardSection, MyListItem, Card } from '../components/common';

class ListDataScreen extends Component {

  state = { showSyncDialog: false };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'DATA',
    headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  onPressFile(item) {
    console.debug('onPressFile item', item);
    this.props.refreshSelectedObs(item);
    this.props.navigation.navigate('detaildata', { originScreen: 'listdata' });
  }

  onPressSync(item) {
    console.debug('onPressFile item', item);
    console.debug('currentAoiId', this.props.currentAoi);

    if (this.props.isConnected && item.toSync) {
      this.props.obsUpdateSaveServer(
        item.key,
        this.props.currentAoi.key,
        this.props.currentGzId,
        item.name,
        item.tree_specie,
        item.crown_diameter,
        item.canopy_status,
        item.comment,
        item.position,
        item.images,
        item.compass,
        this.props.token
      );
    } else {
      const message = (!item.toSync ? strings.itemAlreadySync : strings.funcWithConnection);
      const style = {
        backgroundColor: '#dd8BC34A',
        color: '#ffffff',
        fontSize: 15,
        borderWidth: 5,
        borderRadius: 80,
        fontWeight: 'bold'
      }
      Toast.show(message, Toast.LONG, Toast.CENTER, style);
    }
  }

  goToPressed(item) {

    this.props.navigation.navigate('map', { action: 'goTo', latitude: item.position.latitude, longitude: item.position.longitude });

  }

  _renderItem({ item }) {
    console.debug('renderitem', item);
    const enable = (item.toSync && item.toSync === true ? true : false);
    return (

      <MyListItem keyExtractor={(item, index) => item.key}>
        <View style={styles.colName}>
          <Text style={styles.labelName}> {item.name} </Text>
        </View>
        <View style={styles.colActions}>
          <Icon
            name='file-text-o'
            type='font-awesome'
            onPress={this.onPressFile.bind(this, item)}
          />
          <Icon
            name='map-marker' type='font-awesome'
            onPress={() => this.props.navigation.navigate('map', { action: 'goTo', latitude: item.position.latitude, longitude: item.position.longitude })}
          />
        </View>
        <View style={styles.colSync}>
          <Icon
            name='sync'
            color={enable ? '#000' : '#c2c2c2'}
            onPress={this.onPressSync.bind(this, item)}
          />
        </View>
      </MyListItem>
    );
  }

  isEmpty(obj) {
      for(let key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

  renderDataList() {
    // console.debug('renderDataList this.props.currentAoi.obs', this.props.currentAoi.obs);
    // console.debug(_.values(this.props.currentAoi.obs));
    if (this.isEmpty(this.props.currentAoi.obs)) {
      return (


        <View>
          <CardSection>
            <Icon name='warning' color='#757575' />
            <Text style={styles.labelName}>{strings.noObsMessage}</Text>
          </CardSection>

          <CardSection>
            <Icon name='info' color='#757575' />
            <Text style={styles.labelName}>{strings.infoAddMessage}</Text>
          </CardSection>
        </View>

      );
    }
    return (
      <FlatList
        data={_.values(this.props.currentAoi.obs)}
        renderItem={this._renderItem.bind(this)}
      />
    );
  }

  render() {
    console.debug('render Data Screen', this.props.currentAoi );
    return (
      <View style={styles.container}>

        <Text style={styles.headerText}>{strings.myObservations}</Text>
        {this.renderDataList()}

        <ProgressDialog
            visible={this.props.synchronizing}
            title={strings.progressDialog}
            message={strings.syncMessage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  row: {
    justifyContent: 'center'
  },
  labelName: {
    fontSize: 18,
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },

  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 18,
    textAlign: 'center'
  },
  colName: { flex: 2 },
  colSync: { flex: 1 },
  colActions: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' }
});

const mapStateToProps = ({ auth, mapData, geoZonesData, network }) => {
  const { isConnected } = network;
  const { token } = auth;
  const { currentGzId } = geoZonesData;
  const { currentAoi, currentObs, synchronizing } = mapData;
  return { token, currentAoi, currentObs, currentGzId, synchronizing, isConnected };
};

const myListDataScreen = connect(mapStateToProps, {
  refreshSelectedObs,
  obsUpdateSaveServer
})(ListDataScreen);

export { myListDataScreen as ListDataScreen };
