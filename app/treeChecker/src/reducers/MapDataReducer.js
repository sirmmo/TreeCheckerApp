// import { offlineActionTypes } from 'react-native-offline';
import {
  // REFRESH_OBSLIST,
  AOI_ID_SELECTED,
  OBS_SELECTED,
  ADD_NEW_OBS,
  UPDATE_OBS_AOI,
  SET_URL_MAP_OFFLINE,
  REFRESH_CURRENT_AOI,
  OBS_SELECTED_BY_INDEX,
  SET_SYNC_STATUS,
  CHECK_STATE
} from '../actions/types';

const INITIAL_STATE = {
  //loading: true,
  //obsList: [], //Llistat de GZ
  currentAoi: {},
  currentAoiId: '',
  currentObs: {},
  urlMapOffline: '',
  serverStarted: false,
  server: {},
  synchronizing: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case REFRESH_OBSLIST:
    //   console.log('OBS_GET_SUCCESS');
    //   return { ...state, obsList: action.payload.obsList, currentAoiId: action.payload.currentAoiId };

    case CHECK_STATE:
      console.debug('CHECK_STATE currentAoi', state.currentAoi);
      return { ...state };

    case SET_SYNC_STATUS:
      // console.log(action.payload);
      return { ...state, synchronizing: action.payload };

    case REFRESH_CURRENT_AOI:
      // console.debug(state);
      return { ...state, currentAoi: action.payload, currentAoiId: action.payload.key };

    case SET_URL_MAP_OFFLINE:
      // console.log('SET_URL_MAP_OFFLINE');
      return { ...state, urlMapOffline: action.payload.urlMapOffline, serverStarted: action.payload.serverStarted, server: action.payload.server };

    case AOI_ID_SELECTED:
      // console.log(action.payload);
      return { ...state, currentAoiId: action.payload };

    case OBS_SELECTED:
      // console.log(action.payload);
      return { ...state, currentObs: action.payload };

    case OBS_SELECTED_BY_INDEX:
      return { ...state, currentObs: state.currentAoi.obs[action.payload] };

    case UPDATE_OBS_AOI:
      return { ...state,
              currentAoi: {
                ...state.currentAoi,
                obs: {
                  ...state.currentAoi.obs,
                  [action.payload]: state.currentObs
                }
              }
            };

    // case ADD_NEW_OBS:
    //     console.debug('ADD_NEW_OBS', action.payload);
    //     return { ...state,
    //             currentAoi: {
    //               ...state.currentAoi,
    //               obs: {
    //                 ...state.currentAoi.obs,
    //                 [action.payload.key]: action.payload
    //               }
    //             }
    //           };

    // case offlineActionTypes.FETCH_OFFLINE_MODE:
    //   return { ...state, currentAoiList: state.allAoisList.get(state.currentGzId) };

    default:
      return state;
  }
};
