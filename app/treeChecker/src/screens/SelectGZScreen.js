/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { Button, Card , Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { NavigationActions } from 'react-navigation';
import { geoZonesFetch, gzUpdate } from '../actions';
import { MySpinner } from '../components/common';
import { strings } from './strings.js';

class SelectGZScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const {state, setParams} = navigation;
    // state.params.showModal = false;
    // const {user} = state.params;
    return {
      title: 'Region of interest',//{strings.regionOfInterest},
      // headerRight: <Button textStyle={{width: 0}} icon={{name: 'menu'}} onPress={() => navigation.navigate('menu') } />,
      headerRight: <Icon name='menu' size={30} color='#ffffff' iconStyle={{padding: 4, marginRight: 5}} onPress={() => navigation.navigate('menu') } />
    };
  };

  componentDidMount() {
    const { isConnected, token } = this.props;
    if (isConnected) this.props.geoZonesFetch(token);
    console.debug('this.props.navigation', this.props.navigation);
    // console.debug('NavigationActions', NavigationActions);
    // const resetAction = NavigationActions.reset({
    //   index: 1,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'welcome' }),
    //     NavigationActions.navigate({ routeName: 'selectgz' })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
  }

  renderGZList() {
    if (this.props.loading) {
      return <MySpinner size="large" />;
    }
    //console.log(this.props.geozonesList);
    return (
      <FlatList
        data={this.props.geozonesList}
        // renderItem = { ({item}) => { this.renderGZ(item) } }
        renderItem={({item}) => {
          const enabled = (item.is_enabled === true ? 'enabled':'disabled');
          return (
            <Card
              title={item.name}
              titleStyle={styles.cardTitle}
              keyExtractor={(item, index) => item.key}
              image={{ uri: `file://${RNFS.ExternalDirectoryPath}/pictures/gz/${item.key}.png` }}
              >
              <Text style={{marginBottom: 10, fontSize: 20}}>
              </Text>
              <Button
                iconRight
                icon={{name: 'arrow-circle-right', type: 'font-awesome'}}
                backgroundColor='#8BC34A'
                //fontFamily='Lato'
                onPress={this.onPressGoButton.bind(this, item)}
                disabled={!item.is_enabled}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title={strings.go} />
            </Card>
        );} }
      />
    )
  }

  onPressGoButton(currentGz) {
    console.log('onPressGoButton');
    console.log(currentGz.key);
    this.props.gzUpdate(currentGz);
    this.props.navigation.navigate('listaoi');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Select your region of interest: </Text>
        {this.renderGZList()}
      </View>
    );
  }

  }

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    padding: 15
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18
  }
  });

  const mapStateToProps = ({ geoZonesData, network, auth }) => {
  const { loading, geozonesList } = geoZonesData;
  const { token } = auth;
  const { isConnected } = network;
  return { loading, geozonesList, isConnected, token };
  };

  const mySelectGZScreen = connect(mapStateToProps, {
    geoZonesFetch,
    gzUpdate
  })(SelectGZScreen);

  export { mySelectGZScreen as SelectGZScreen };
