import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { ConnectivityRenderer } from 'react-native-offline';

import { usernameChanged, passwordChanged, loginUser } from '../actions';
import { Card, MySpinner, CardSection } from '../components/common';
import { strings } from './strings.js';


class LoginScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    //title: 'Log In',
    //headerRight: <Button color={screenProps.tintColor} {...} />,
    header: null
  });

  onUsernameChanged(text) {
    this.props.usernameChanged(text);
  }

  onPasswordChanged(text) {
	//console.log(text);
	this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { username, password, navigation, isConnected } = this.props;
    console.log(username);
    console.log(password);
    this.props.loginUser({ username, password, navigation });
  }

  renderButton() {
    if (this.props.loading) {
      return <MySpinner size="large" />;
    }

    return (
      <Button
        raised
        containerViewStyle={styles.ContButtonStyle}
        backgroundColor='#8BC34A'
        title={strings.login}
        underlayColor='#c2c2c2'
        onPress={this.onButtonPress.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel labelStyle={styles.labelStyle}>{strings.Username}</FormLabel>
        <FormInput
          placeholder={strings.username}
          onChangeText={this.onUsernameChanged.bind(this)}
          value={this.props.username}
        />

        <FormLabel labelStyle={styles.labelStyle}>{strings.Password}</FormLabel>
        <FormInput
          secureTextEntry
          placeholder={strings.password}
          onChangeText={this.onPasswordChanged.bind(this)}
          value={this.props.password}
        />
        <FormValidationMessage labelStyle={styles.errorTextStyle}>{this.props.error}</FormValidationMessage>
        <ConnectivityRenderer>
          {isConnected => (
            isConnected ? (
              this.renderButton()
            ) : (
              <CardSection>
                <Icon name='warning' />
                <Text style={styles.errorTextStyle}>Network connection needed</Text>
              </CardSection>
            )
          )}
        </ConnectivityRenderer>
      </View>
    );
  }
}

const styles = {
  container: {
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 10,
      marginBottom: 10,
  },
  errorTextStyle: {
    marginTop: 5,
    fontSize: 16,
    alignSelf: 'center',
    color: 'red'
  },
  labelStyle: {
    fontSize: 20
  },
  ContButtonStyle: {
    margin: 30
  }
};

const mapStateToProps = ({ auth, network }) => {
  const { username, password, error, loading } = auth;
  const { isConnected } = network;

  return { username, password, error, loading, isConnected };
};

const myLoginScreen = connect(mapStateToProps, {
  usernameChanged,
  passwordChanged,
  loginUser
})(LoginScreen);

export { myLoginScreen as LoginScreen };
