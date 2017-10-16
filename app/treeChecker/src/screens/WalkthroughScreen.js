import React, { Component } from 'react';
import Slides from '../components/Slides.js';
import { strings } from './strings.js';
//import SLIDE_DATA from './tutorial.js';

export const SLIDE_DATA = [
  {
    pageID: 0,
    title: 'Region of interest',
    text: 'First of all choose your region of interest, among the available options.',
    imgFile: require('./resources/img/selectGZ.png')
  },
  { pageID: 1,
    title: 'Area of interest',
    text: 'Select your area of interest. In case you have not created one yet, proceed to it, by pressing the bottom right button. ',
    imgFile: require('./resources/img/aoiList.png')
  },
  {
    pageID: 2, title: 'Create area of interest 1/2',
    text: 'Drag the vertexs of the polygon to cover the area you are interested in. Once the process will be finished, all the area will be available in offline mode. Take into account that big areas will suppose more dowloading time, and more storage space in your device.',
    imgFile: require('./resources/img/createAOI.png')
  },
  {
    pageID: 3, title: 'Create area of interest 2/2',
    text: 'Type a name for the new area, and press the Download button. The downloading process could need some time to finish.',
    imgFile: require('./resources/img/downloadAOI.png')
  },
  {
  pageID: 4, title: 'Map visualization',
  text: 'Once you have selected an area, you will enter in the Map View. Here you can navigate through the map and explore all the observations available in the area. And also, you can check and edit you own observations, by pressing on them.',
  imgFile: require('./resources/img/mapView.png')
  },
  {
  pageID: 5, title: 'Data Visualization',
  text: 'By pressing the Data tab, you also can visualize all your data in a List mode. From here you can check if any of your observations is not synchronized with the server, and solve it by forcin it.',
  imgFile: require('./resources/img/dataView.png')
  },
  {
  pageID: 6, title: 'Detail Data',
  text: 'You can check the available information of the observations',
  imgFile: require('./resources/img/viewSD.png')
  },
  {
  pageID: 7, title: 'Edit Data',
  text: 'You can edit the available information of the observations',
  imgFile: require('./resources/img/editSD.png')
	},
	{
	pageID: 8, title: 'Menu',
	text: 'By pressing the menu button, on the top right header of the main screens, you access to your user profile (and do log out), and tou this tutorial again.',
	imgFile: require('./resources/img/menu.png')
	}
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
		<Slides data={SLIDE_DATA} navigation={this.props.navigation} />
    );
  }

}

export { WalkthroughScreen };
