// import { offlineActionTypes } from 'react-native-offline';
import {
  // REFRESH_OBSLIST,
  AOI_ID_SELECTED,
  OBS_SELECTED,
  ADD_OBS_AOI,
  UPDATE_OBS_AOI,
  SET_URL_MAP_OFFLINE,
  REFRESH_CURRENT_AOI,
  OBS_SELECTED_BY_INDEX,
  SET_SYNC_STATUS,
  CHECK_STATE,
  UPDATE_CURRENTAOI_TOSYNC,
  UPDATE_INDEX_OBS_AOI,
  // OBS_DELETE_AOI,
  OBS_DELETE,
  OBS_DELETE_LOCAL
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

    case UPDATE_INDEX_OBS_AOI: {
    const { newKey, oldKey, tree_specie_key } = action.payload;
    const obs = { ...state.currentAoi.obs[oldKey] };
    console.debug('UPDATE_INDEX_OBS_AOI', obs);
    obs.key = newKey;
    obs.tree_specie.key = tree_specie_key;
    return { ...state,
            currentAoi: {
              ...state.currentAoi,
              obs: {
                ...state.currentAoi.obs,
                [newKey]: obs
              }
            }
          };
    }
    // case OBS_DELETE_AOI: {
    case OBS_DELETE: {
          const { key } = action.payload;
          const newObs = { ...state.currentAoi.obs };
          delete newObs[key];
          return { ...state,
                  currentAoi: {
                    ...state.currentAoi,
                    obs: newObs
                  }
                };
    }
    case OBS_DELETE_LOCAL: {
          const { key } = action.payload;
          const newObs = { ...state.currentAoi.obs };
          const deletedObs = { ...newObs[key], key: `deleted_${key}`, toSync: true };
          //deletedObs.key = `deleted_${deletedObs.key}`;
          delete newObs[key];

          return { ...state,
                  currentAoi: {
                    ...state.currentAoi,
                    obs: {
                      ...newObs,
                      [`deleted_${key}`]: deletedObs
                    }
                  }
                };
    }
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
    case UPDATE_CURRENTAOI_TOSYNC: {
      const { sobsKey, saoiId, sync, tree_specie } = action.payload;
      // const list = state.allAoisList allAoisList[gzId][aoiId].obs[obsKey].images : images
      if (state.currentAoiId === saoiId) {
        return { ...state,
                currentAoi: {
                  ...state.currentAoi,
                  obs: {
                    ...state.currentAoi.obs,
                    [sobsKey]: {
                      ...state.currentAoi.obs[sobsKey],
                      tree_specie,
                      toSync: sync
                    }
                  }
                }
              };
      }
        return { ...state };
    }

    case ADD_OBS_AOI:
        console.debug('ADD_OBS_AOI', action.payload);
        return { ...state,
                currentAoi: {
                  ...state.currentAoi,
                  obs: {
                    ...state.currentAoi.obs,
                    [action.payload.key]: action.payload
                  }
                }
              };

    // case offlineActionTypes.FETCH_OFFLINE_MODE:
    //   return { ...state, currentAoiList: state.allAoisList.get(state.currentGzId) };

    default:
      return state;
  }
};
