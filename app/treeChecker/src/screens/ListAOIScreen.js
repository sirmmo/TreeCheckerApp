/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Button, Icon, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import _ from 'lodash';

import { aoiListFetch, refreshSelectedAoi, deleteAOI } from '../actions';
import { MySpinner, CardSection, MyListItem } from '../components/common';
import { strings } from './strings.js';


class ListAOIScreen extends Component {

  state = { showDeleteModal: false, key: '' };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'AOI List',
    // headerRight: <Button icon={{name: 'menu'}} onPress={() => navigation.navigate('menu') } />,
    headerRight: <Icon name='menu' size={30} color='#ffffff' iconStyle={{padding: 4, marginRight: 5}} onPress={() => navigation.navigate('menu') } />
    // tabBarVisible: false
  });


  componentDidMount() {
    const { token, currentGzId, allAoisList } = this.props;
    console.log('componentDidMount');
    this.props.aoiListFetch({ token, currentGzId, allAoisList });
  }

  onPressItem(item) {
    // console.log('OnPressItem...');
    // console.log(item);
    this.props.refreshSelectedAoi(item);
    this.props.navigation.navigate('mapflow', { action: 'initMap' });
  }

  onDeletePressed() {

    const { token } = this.props;
    const { key } = this.state;
    this.props.deleteAOI({ token, key });
    this.setState({ showDeleteModal: false, key: '' });


  }

  _renderItem({ item }) {
    console.debug('item', item);
    console.debug('item.length', item.length);
    return (
      <MyListItem keyExtractor={(item, index) => item.key}>
        <View style={styles.colName}>
            <Text style={styles.name}
              onPress = { this.onPressItem.bind(this, item)}
            >
            {item.name}
            </Text>
        </View>
        <View style={styles.colActions}>
            <Icon
              style={styles.icon}
              name='map-marker'
              type='font-awesome'
              //onPress={this.onDeletePressed.bind(this, item.key)}
            />
            <Text>:</Text>
            <Badge
              containerStyle={{ backgroundColor: '#388E3C'}}
              value={Object.keys(item.obs).length}
            />
        </View>
        <View style={styles.colActions}>
            <Icon
              style={styles.icon}
              name='trash-o'
              type='font-awesome'
              onPress={() => this.setState({ showDeleteModal: !this.state.showDeleteModal, key: item.key })}
            />
        </View>

        <View style={styles.colRight}>
            <Icon
              style={styles.icon}
              name='chevron-right'
              onPress={this.onPressItem.bind(this, item)}
            />
        </View>
      </MyListItem>
    );
  }

  renderDataList() {

    if (this.props.loading) {
      return <MySpinner size="large" />;
    }

    const { currentAoiList } = this.props;
    if (Object.keys(currentAoiList).length === 0) {
      return (
        <CardSection>
          <Icon name='warning' color='#757575' />
          <Text style={styles.labelName}>No AOIs added</Text>
        </CardSection>
      );
    }
    return (
      <FlatList
        data={_.values(currentAoiList)}
        renderItem={this._renderItem.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{strings.selectAOItitle}</Text>
        <ScrollView>
          {this.renderDataList()}
        </ScrollView>
        <View style={styles.row}>
          <Icon
            raised
            reverse
            name='add-to-list'
            type='entypo'
            color='#8BC34A'
            size={30}
            onPress={this.onNewButtonPress.bind(this)}/>
        </View>

        <ConfirmDialog
            title={strings.deleteObservation}
            message={strings.confirmDeleteMessage}
            visible={this.state.showDeleteModal}
            color='#8BC34A'
            onTouchOutside={() => this.setState({ showDeleteModal: false })}
            positiveButton={{
                title: strings.yes,
                onPress: () => this.onDeletePressed()
            }}
            negativeButton={{
                title: strings.no,
                onPress: () => this.setState({ showDeleteModal: false })
            }}
        />
      </View>
    );
  }

  onNewButtonPress() {
    this.props.navigation.navigate('createaoi');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: 15,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    margin: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  name: {
    fontSize: 18
  },
  colName: { flex: 2 },
  colRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  colActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  containerButton: {
    flex: 1,
    margin: 30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  }
});

const mapStateToProps = ({ geoZonesData, auth }) => {
  const { loading, currentAoiList, currentGzId, allAoisList} = geoZonesData;
  const { token } = auth;
  return { loading, currentAoiList, currentGzId, allAoisList, token};
};

const myListAOIScreen = connect(mapStateToProps, {
  aoiListFetch,
  refreshSelectedAoi,
  deleteAOI
})(ListAOIScreen);

export { myListAOIScreen as ListAOIScreen };
