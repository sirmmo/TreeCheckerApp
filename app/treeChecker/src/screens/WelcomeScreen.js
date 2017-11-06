import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { connect } from 'react-redux';
// import { checkToken } from '../actions';
import { Tile, Button } from 'react-native-elements';

import RNFS from 'react-native-fs';
import { NavigationActions } from 'react-navigation'


class WelcomeScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarVisible: false
  });

  initApp() {
    const { navigation, currentAoi, geozonesList, allAoisList, currentGzId, currentAoiList, token, username, password, canopyList } = this.props;
    console.debug('initApp.................');
    console.debug('token', token);
    console.debug('username', username);
    console.debug('password', password);
    console.debug('canopyList', canopyList);

    console.debug('currentAoi', currentAoi);
    console.debug('geozonesList', geozonesList);
    console.debug('allAoisList', allAoisList);
    console.debug('currentGzId', currentGzId);
    console.debug('currentAoiList', currentAoiList);
    console.debug('--------------------------------');
    console.debug('RNFS.DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
    console.debug('RNFS.ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
    console.debug('RNFS.ExternalStorageDirectoryPath', RNFS.ExternalStorageDirectoryPath );
    console.debug('--------------------------------');
    console.debug('navigation', navigation);
    // console.debug('actionQueue', actionQueue);
    console.debug('--------------------------------');

    if (token !== -1) {
      navigation.navigate('mainflow');
      // navigation.dispatch(NavigationActions.navigate({ routeName: 'selectgz', params: {} }));
    } else {
      navigation.navigate('initflow');
    }
  }

  render() {
    const src = require('./resources/img/tree3.jpg');


    return (
      <Image source={src} style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Canhemon App</Text>
          <Text style={styles.subtitle}>Welcome</Text>
              <Button
                buttonStyle={styles.button}
                iconRight
                icon={{ name: 'replay' }}
                onPress={this.initApp.bind(this)}
                backgroundColor='#388E3C'
                title='START' />
        </View>
      </Image>
    );

    // return (
    //   <View style={styles.container}>
    //     <Tile
    //        imageSrc={src}
    //        title="Canhemon App"
    //        featured
    //        caption="Welcome"
    //        imageContainerStyle={{flex: 1, resizeMode: 'cover'}}
    //     />
    //     <Button
    //       buttonStyle={styles.button}
    //       iconRight
    //       icon={{ name: 'cached' }}
    //       onPress={this.initApp.bind(this)}
    //       backgroundColor='#8BC34A'
    //       title='START' />
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#C8E6C9'
  },
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#11C8E6C9'
  },
  title: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
  subtitle: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
  button: {
    marginTop: 50
  }
});

const mapStateToProps = ({ auth, mapData, geoZonesData, selectFormData }) => {
const { token, username, password } = auth;
const { currentAoi } = mapData;
const { canopyList } = selectFormData;
const { geozonesList, allAoisList, currentGzId, currentAoiList } = geoZonesData;
return { currentAoi, token, username, password, canopyList, geozonesList, allAoisList, currentGzId, currentAoiList };
};

const myWelcomeScreen = connect(mapStateToProps, {
  // checkToken
})(WelcomeScreen);

export { myWelcomeScreen as WelcomeScreen };
