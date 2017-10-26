import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Slides from '../components/Slides.js';
import { strings } from './strings.js';


export const SLIDE_DATA = [
  {
    pageID: 0,
    title: 'Region of interest',
    text: 'First of all choose your region of interest, among the available options.',
    imgFile: require('./resources/img/selectGZ2.png')
  },
  { pageID: 1,
    title: 'Area of interest',
    text: 'Select your area of interest. In case you have not created one yet, proceed to it, by pressing the bottom right button. ',
    imgFile: require('./resources/img/aoiList2.png')
  },
  {
    pageID: 2, title: 'Create area of interest 1/2',
    text: 'Drag the vertices of the polygon to cover the area you are interested in. Once the process will be finished, all the area will be available in offline mode.',
    imgFile: require('./resources/img/createAOI2.png')
  },
  {
    pageID: 3, title: 'Create area of interest 2/2',
    text: 'Type a name for the new area, and press the Download button. Take into account that big areas will suppose more dowloading time, and more storage space needed in your device.',
    imgFile: require('./resources/img/nameAOI2.png')
  },
  {
  pageID: 4, title: 'Map Visualization',
  text: 'Once you have selected an area, you will enter in the Map View. Here you can navigate through the map and explore all the observations available in the area.',
  imgFile: require('./resources/img/mapView2.png')
  },
  {
  pageID: 5, title: 'Data Visualization',
  text: 'By pressing the Data tab, you also can visualize all your data in a list. From here you can check if any of your observations is not synchronized with the server and force it.',
  imgFile: require('./resources/img/dataView2.png')
  },
  {
  pageID: 6, title: 'Detail Data',
  text: 'You can check the detailed data of your observations too.',
  imgFile: require('./resources/img/viewSD2.png')
  },
  {
  pageID: 7, title: 'Edit Data',
  text: 'And finally, you can edit the information of the observations.',
  imgFile: require('./resources/img/editSD2.png')
  },
  {
  pageID: 8, title: 'Menu',
	imgFile: require('./resources/img/menu2.png')
  }
  text: 'By pressing the menu button (top right header of the main screens), you can access to your user profile to view this tutorial again.',
];

class WalkthroughScreen extends Component {

	static navigationOptions = ({ navigation, screenProps }) => ({
    //title: 'Walkthrough',
    //headerRight: <Button color={screenProps.tintColor} {...} />,
		header: null,
    tabBarVisible: false
  });

	onSkipButtonPress() {
    console.log('onSkipButtonPress');
		this.props.navigation.navigate('mainflow');
  }

  render() {
		console.debug(SLIDE_DATA);
    return (
    <View style={styles.container}>
		  <Slides data={SLIDE_DATA} navigation={this.props.navigation} />
    </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { WalkthroughScreen };
