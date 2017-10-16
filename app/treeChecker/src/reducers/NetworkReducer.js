import { reducer as network } from 'react-native-offline';

type INITIAL_STATE = {
  isConnected: boolean,
  actionQueue: Array<*>
};
