import getStore from "./store";

class App extends Component {

  store = getStore(AppReducer);

  render() {
    return (
      <Provider store={store}>
				// <Routes navigation={this.props.navigation} />
				<AppWithNavigationState />
      </Provider>
    );
  }
}
export default App;
