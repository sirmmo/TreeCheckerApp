// Import libraries for making a component
import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

// Make a component
const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  const { icon, headerText } = props;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{headerText}</Text>
      <Icon name={icon} color='#ffffff'/>
    </View>
  );
};

const styles = {
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    height: 40,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    width: '100%'
  },
  textStyle: {
    fontSize: 18,
    color: '#ffffff'
  }
};

// Make the component available to other parts of the app
export { Header };
