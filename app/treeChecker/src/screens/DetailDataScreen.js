/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Grid, Col, Row } from 'react-native-elements';
// import LocalizedStrings from 'react-native-localization';
import RNFS from 'react-native-fs';
import { ConfirmDialog } from 'react-native-simple-dialogs';

import { Card, CardSection } from '../components/common';
import { strings } from './strings.js';
import { deleteObsLocal, deleteObsServer } from '../actions';

class DetailDataScreen extends Component {

  state = { showDeleteModal: false, item: {} };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Detail Data Observation',
    tabBarVisible: false
    //headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
  });

  onPressEdit() {
    this.props.navigation.navigate('editdata');
  }

  onPressDeleteObs (){
    const { currentObs, currentAoiId, token } = this.props;
    this.setState({ showDeleteModal: false })
    this.props.deleteObsLocal(currentObs.key, currentAoiId);
    this.props.deleteObsServer(currentObs, currentAoiId, token);
    this.props.navigation.navigate('listdata');
    //TODO delete quan has tancat sessio queeee?
  }

  renderButtons(currentObs) {
    return (
      <View style={styles.rowButtons}>
            <Button
              raised
              iconRight
              backgroundColor='#b71c1c'
              onPress={() => this.setState({ showDeleteModal: !this.state.showDeleteModal })}
              icon={{ name: 'trash', type: 'font-awesome' }}
              title={strings.delete} />

              <Button
                raised
                iconRight
                backgroundColor='#8BC34A'
                onPress={this.onPressEdit.bind(this)}
                icon={{ name: 'edit' }}
                title={strings.edit} />

            <Button
              raised
              iconRight
              backgroundColor='#8BC34A'
              onPress={() => this.props.navigation.navigate('map', { action: 'goTo', latitude: this.props.currentObs.position.latitude, longitude: this.props.currentObs.position.longitude })}
              icon={{ name: 'map', type: 'font-awesome' }}
              title={strings.goto} />
      </View>
    );
  }

  _renderImageItem = ({ item }) => {

    const img_uri = (item.uri ? item.uri : `file://${RNFS.ExternalDirectoryPath}/pictures${item.url}` );
    return (
      <Image style={{marginRight: 5, width: 200, height: 200 }} source={{uri: img_uri }} />
    );
  }

  renderImages(images) {
    if(images.length === 0){
      return (
        <CardSection>
          <Image style={{marginRight: 5, width: 200, height: 200 }} source={require('./resources/img/noimage.jpg')} />
        </CardSection>
      );
    }
    return (
      <CardSection>
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => item.key}
          renderItem={this._renderImageItem}
        />
      </CardSection>
    );
  }

  renderComment(comment) {
    if (comment !== null && comment !== '') {
      return (
        <CardSection>
          <Text style={styles.labelName}>{strings.comment}</Text>
          <Text style={styles.valueName}>{comment}</Text>
        </CardSection>
      );
    }
  }

  renderData(currentObs) {
    return (
        <ScrollView>
        {this.renderImages(currentObs.images)}
          <CardSection>
            <Text style={styles.labelName}>{strings.treeSpecies}</Text>
            <Text style={styles.valueName}>{currentObs.tree_specie.name}</Text>
          </CardSection>
          <CardSection>
            <Text style={styles.labelName}>{strings.crown}</Text>
            <Text style={styles.valueName}>{currentObs.crown_diameter.name}</Text>
          </CardSection>
          <CardSection>
            <Text style={styles.labelName}>{strings.canopy}</Text>
            <Text style={styles.valueName}>{currentObs.canopy_status.name}</Text>
          </CardSection>
          {this.renderComment(currentObs.comment)}
        </ScrollView>

    );
  }

  render() {
    // console.debug('this.props', this.props);
    const { currentObs } = this.props;
    // console.debug('currentObs', currentObs);

    return (
      <View style={styles.container}>

        <View style={styles.containerData}>
          <CardSection style={styles.detailHeader}>
            <Text style={styles.labelHeader}>{currentObs.name}</Text>
          </CardSection>
          {this.renderData(currentObs)}
        </View>

        <View style={styles.containerButtons}>
          {this.renderButtons(currentObs)}
        </View>

        <ConfirmDialog
            title={strings.deleteObservation}
            message={strings.confirmDeleteMessage}
            visible={this.state.showDeleteModal}
            onTouchOutside={() => this.setState({ showDeleteModal: false })}
            positiveButton={{
                title: strings.yes,
                onPress: () => this.onPressDeleteObs()
            }}
            negativeButton={{
                title: strings.no,
                onPress: () => this.setState({ showDeleteModal: false })
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  containerData: {
    width: '100%',
    flex: 5,
  },
  containerButtons: {
    paddingTop: 15,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },

  detailHeader: {
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#4CAF50',
  },
  labelHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#ffffff'
  },

  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop:20
  },
  labelName: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 18
  },
  valueName: {
    flex: 2,
    fontSize: 18
  }
});


const mapStateToProps = ({ mapData, auth }) => {
  const { token } = auth;
  const { currentObs, currentAoiId } = mapData;
  return { currentObs, currentAoiId, token };
};

const myDetailDataScreen = connect(mapStateToProps, {
  deleteObsLocal,
  deleteObsServer
})(DetailDataScreen);

export { myDetailDataScreen as DetailDataScreen };
