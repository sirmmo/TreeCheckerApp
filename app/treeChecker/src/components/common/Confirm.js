import React from 'react';
import { Modal, View, Text } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
  const { cardSelectionStyle, textStyle, containerStyle } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={containerStyle}>

        <CardSection style={cardSelectionStyle}>
          <Text style={textStyle}>{children}</Text>
        </CardSection>

        <CardSection>
          <Button onPress={onAccept}>Yes</Button>
          <Button onPress={onDecline}>No</Button>
        </CardSection>

      </View>
    </Modal>
  );
};

const styles = {
  cardSelectionStyle: {
    justifyContent: 'center'
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    justifyContent: 'center'
  }
};

export { Confirm };
