import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { withNetworkConnectivity } from 'react-native-offline';

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

// export const AppNavigator = StackNavigator({
//   Login: { screen: LoginScreen },
//   Main: { screen: MainScreen },
//   Profile: { screen: ProfileScreen },
// });

export let AppNavigator = StackNavigator({
  welcome: { screen: WelcomeScreen },
  initflow: {
    screen: StackNavigator({
      login: { screen: LoginScreen },
      walkthrough: { screen: WalkthroughScreen }
    })
  },
  mainflow: {
    screen: StackNavigator({
      selectgz: { screen: SelectGZScreen },
      listaoi: { screen: ListAOIScreen },
      createaoi: { screen: CreateAOIScreen }
    })
  },
  mapflow: {
    screen: TabNavigator({
      map: { screen: MapScreen },
      listdata: { screen: ListDataScreen }
    }, {
      animationEnabled: true,
      swipeEnabled: false,
      tabBarVisible: true,
      tabBarPosition: 'bottom'
    })
  },
  modaldataflow: {
    screen: StackNavigator({
      createdata: { screen: CreateDataScreen },
      detaildata: { screen: DetailDataScreen },
      editdata: { screen: EditDataScreen },
    })
  },
  menuflow: {
    screen: StackNavigator({
      menu: { screen: MenuScreen },
      profile: { screen: ProfileScreen }
    })
  }
});

AppNavigator = withNetworkConnectivity({
  withRedux: true // It won't inject isConnected as a prop in this case
})(AppNavigator);

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
