/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal
} from 'react-native';
import { FormInput, Button, FormLabel, ListItem, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview-messaging/WebView';
import LocalizedStrings from 'react-native-localization';
import ProgressBar from 'react-native-progress/Bar';
import { Dialog } from 'react-native-simple-dialogs';

import { downloadTiles, resetDownload, setAOIModalVisible } from '../actions';
import { CardSection } from '../components/common';
import { strings } from './strings.js';


class CreateAOIScreen extends Component {

	state = { isValid:false, aoiName:"", isDownloading:false };

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Create AOI (1/2)',
		//headerRight: <Button icon={{ name: 'menu' }} onPress={() => console.log('onPress Menu')} />,
		tabBarVisible: false
	});

	componentDidMount() {

		this.props.resetDownload();
		this.subscribeMessages();

	}

	receiveServerData(json) {

		if(json.webInit) {

			this.sendInitParams();

		} else {

			this.setState({isValid: json.isValid});
			this.setState({bbox: json.bbox});
			this.setState({zoomLevel: json.zoom});

		}

	}

	sendInitParams() {

		const {currentGZBbox} = this.props;

		this.webview.sendJSON({ bbox: currentGZBbox });
		console.log("--------- Send init params: " + JSON.stringify(currentGZBbox));

	}

	setWebView(webview) {

		this.webview = webview;

	}

	setModalVisible(isVisible) {
		this.props.setAOIModalVisible(isVisible);
	}

	downloadData() {
		const {bbox, zoomLevel, aoiName} = this.state;
		const {navigation, token, currentGzId} = this.props;
		this.setState({isDownloading: true});
		this.props.downloadTiles({ aoiName, bbox, zoomLevel, navigation, token, currentGzId});
	}

	subscribeMessages() {

		const { messagesChannel } = this.webview;
		messagesChannel.on('json', (json) => this.receiveServerData(json) );

	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderMap()}
				{this.renderModal()}
        <View style={styles.containerButtons}>
          <Button
            iconRight
            icon={{name: 'arrow-right', type: 'foundation'}}
            style={styles.button}
            disabled={!this.state.isValid}
            backgroundColor='#8BC34A'
            onPress={() => this.setModalVisible(true)}
            title={strings.next}
          />
        </View>

			</View>
		);
	}

	renderMap() {
		return (
			<View style={styles.containerMap}>
        <Text style={styles.headerText}>{strings.selNewAOI}</Text>
				<WebView
					source={{ uri: 'file:///android_asset/web/createAOI.html' }}
					ref={ (webview) => { this.setWebView(webview); } }
					style={{ flex: 1, borderBottomWidth: 1, padding: 20 }}
				/>
			</View>
		);
	}

  renderModal() {
		return (
      <Dialog
          visible={this.props.createAOIModalVisible}
          title={strings.createAOI2}
          onTouchOutside={() => this.setModalVisible(false)} >
          <View>

              <Text style={styles.headerText2}>{strings.nameAOI}</Text>
              <FormLabel labelStyle={styles.labelName2}>{strings.name}</FormLabel>
              <FormInput
                underlineColorAndroid='#8BC34A'
                placeholder={strings.aoiNameInput}
                onChangeText={(text) => {this.setState({aoiName: text})}}
                disabled={!this.state.isDownloading}
              />

            <View style={styles.containerButtons}>
              {this.renderButtons()}
            </View>

          </View>
      </Dialog>
		);
	}

	renderModal2() {
		return (

			<Modal
				animationType="fade"
				transparent={true}
				visible={this.props.createAOIModalVisible}
				onRequestClose={() => this.setModalVisible(false)}
				>
        <View style={styles.containerModal}>
        <Card
          title={strings.nameAOI}
          titleStyle={styles.headerText}
          containerStyle={{ backgroundColor: '#e8f5e9'}}
          >

            <FormLabel labelStyle={styles.labelName}>{strings.name}</FormLabel>
            <FormInput
              underlineColorAndroid='#8BC34A'
              placeholder={strings.aoiNameInput}
              onChangeText={(text) => {this.setState({aoiName: text})}}
              disabled={!this.state.isDownloading}
            />

          <View style={styles.containerButtons}>
            {this.renderButtons()}
          </View>
        </Card>
        </View>
			</Modal>

		);
	}



	renderButtons() {

		if(this.props.isDownloading) {

			return (
				<View style={styles.containerProgress}>
					<ProgressBar
            height={12}
            color='#4CAF50'
            unfilledColor='#C8E6C9'
            borderColor='#FFFFFF'
            progress={this.props.fetchImagesProgress}
          />
				</View>
			);

		} else {

			const { aoiName } = this.state;
			const isEnabled = aoiName.length;

			return (
				<View style={styles.rowButtons}>
          <Button
            buttonStyle={styles.reverseButtonStyle}
            //buttonStyle={{flex: 1}}
            backgroundColor='#ffffff'
            color='#8BC34A'
            iconRight

            icon={{name: 'arrow-left', type: 'foundation', color: '#8BC34A'}}
            onPress={() => this.setModalVisible(false)}
            title={strings.prev}
            accessibilityLabel={strings.close}
          />
					<Button
            iconRight
            backgroundColor='#8BC34A'
            icon={{ name: 'download', type: 'font-awesome' }}
						disabled={this.state.aoiName.length <= 0}
						onPress={this.downloadData.bind(this)}
						title={strings.download}
					/>
				</View>
			);

		}

	}

};

const styles = StyleSheet.create({
	container: {
		flex: 1,
    paddingBottom: 10,
    backgroundColor: '#C8E6C9'
	},
  containerMap: {
		flex: 1,
    paddingBottom: 5,
	},
  containerModal: {
    // alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // flex: 1,
    // justifyContent: 'center',
    // marginVertical: '50%',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    padding: 15
  },
  headerText2: {
    fontWeight: 'bold',
    textAlign: 'justify',
    fontSize: 15,
    padding: 5
  },
  containermodal: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10
  },
	button: {
    margin: 5
	},
  reverseButtonStyle: {

		borderColor: '#8BC34A',
		borderWidth: 1
	},
  labelName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#86939e'
  },
  labelName2: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#86939e'
  },
  containerButtons: {
    paddingTop: 5,

    //minHeight: '15%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  containerProgress: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = ({ geoZonesData, auth }) => {
	const { fetchImagesProgress, isDownloading, geozonesList, currentGzId, currentGZName, currentGZBbox, createAOIModalVisible  } = geoZonesData;
	const { token } = auth;
	return { fetchImagesProgress, isDownloading, token, geozonesList, currentGzId, currentGZName, currentGZBbox, createAOIModalVisible  };
};

const myCreateAOIScreen = connect(mapStateToProps, {
	downloadTiles,
	resetDownload,
	setAOIModalVisible,
})(CreateAOIScreen);

export { myCreateAOIScreen as CreateAOIScreen };
