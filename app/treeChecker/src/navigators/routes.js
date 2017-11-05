import { TabNavigator, StackNavigator } from 'react-navigation';
// import { withNetworkConnectivity } from 'react-native-offline';
import {
	LoginScreen,
	WelcomeScreen,
	WalkthroughScreen,
	SelectGZScreen,
	ListAOIScreen,
	CreateAOIScreen,
	MapScreen,
	ListDataScreen,
	CreateDataScreen,
	EditDataScreen,
	DetailDataScreen,
	MenuScreen,
	ProfileScreen
} from '../screens';

const InitFlow = StackNavigator({
	login: { screen: LoginScreen }
});

// const WalkFlow = StackNavigator({
// 	walkthrough: { screen: WalkthroughScreen }
// });

const MainFlow = StackNavigator({
	selectgz: { screen: SelectGZScreen },
	listaoi: { screen: ListAOIScreen },
	createaoi: { screen: CreateAOIScreen }
}, {
	navigationOptions: {
		headerTintColor: '#ffffff',
		headerStyle: { backgroundColor: '#4CAF50' },
		headerTitleStyle: {width: '80%'},
	}
});

const MapFlow = TabNavigator({
	map: { screen: MapScreen },
	listdata: { screen: ListDataScreen }
}, {
	animationEnabled: true,
	swipeEnabled: false,
	tabBarVisible: true,
	tabBarPosition: 'top',
	//lazy: true,
	tabBarOptions: {
		indicatorStyle: {
			backgroundColor: '#b2ff59'
		},
		activeTintColor: '#ffffff',
		activeBackgroundColor: '#4CAF50',
		inactiveTintColor: '#C8E6C9',
		inactiveBackgroundColor: '#C8E6C9',
		labelStyle: {
			fontSize: 16,
		},
		style: {
			backgroundColor: '#4CAF50',
		}
	}
});

const Menu = StackNavigator({
	menu: { screen: MenuScreen }
}, {
	mode: 'modal',
	navigationOptions: {
		title: 'Menu',
		headerTintColor: '#ffffff',
		headerStyle: { backgroundColor: '#4CAF50' }
	}
});

// const Profile = StackNavigator({
// 	profile: { screen: ProfileScreen }
// }, {
// 	mode: 'modal',
// 	navigationOptions: {
// 		title: 'Menu',
// 		headerTintColor: '#ffffff',
// 		headerStyle: { backgroundColor: '#4CAF50' }
// 	}
// });

const Routes = {
  welcome: { screen: WelcomeScreen },
  initflow: { screen: InitFlow },
	walkthrough: { screen: WalkthroughScreen },
  mainflow: { screen: MainFlow },
  mapflow: { screen: MapFlow },
	detaildata: { screen: DetailDataScreen },
	editdata: { screen: EditDataScreen },
	createdata: { screen: CreateDataScreen },
	menu: { screen: Menu },
	profile: { screen: ProfileScreen }
};

// Routes = withNetworkConnectivity({
// 	withRedux: true // It won't inject isConnected as a prop in this case
// })(Routes);

export default Routes;
