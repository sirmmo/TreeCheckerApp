import { offlineActionTypes } from 'react-native-offline';
import {
  GEOZONES_FETCH_SUCCESS,
  ALL_AOIS_FETCH_SUCCESS,
  LOADING_GEOZONES_DATA,
  LOADING_DATA,
  AOI_LIST_FETCH_SUCCESS,
  GZ_SELECTED,
  AOI_LIST_FETCH_ASYNC,
  UPDATE_PROGRESS,
  UPDATE_TOTAL,
  SET_DOWNLOAD_STATUS,
  CHECK_STATE,
  RESET_STATE,
  UPDATE_OBS_IMAGES,
  UPDATE_OBS_TOSYNC,
  CLEAR_FETCHED_IMAGES,
  ADD_NEW_OBS,
  OBS_DELETE,
  UPDATE_INDEX_OBS,
  AOI_MODAL_VISIBLE,
  AOI_DELETE,
  UPDATE_OBS_ALLAOI
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
  geozonesList: {}, //Llistat de GZ
  allAoisList: {}, //Llistat de totes les AOIs per cada GZ
  currentGzId: '',
  currentGZName: "",
  currentGZBbox: {},
  // currentAoiList: [],
  fetchedImages: 0,
  fetchImagesProgress: 0.0,
  fetchImagesTotal: 0,
  isDownloading: false,
  currentAoiList: {},
  createAOIModalVisible: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case CHECK_STATE:
      console.debug('CHECK_STATE allAoisList', state.allAoisList);
      return { ...state };

    case RESET_STATE:
      return { ...INITIAL_STATE };

    case GEOZONES_FETCH_SUCCESS:
      console.log('GEOZONES_FETCH_SUCCESS');
      //console.log(action.payload);
      return { ...state, geozonesList: action.payload };

    case AOI_LIST_FETCH_SUCCESS:
      console.log('AOI_LIST_FETCH_SUCCESS');
      console.log(action.payload);
      return { ...state, currentAoiList: action.payload, loading: false };

    case ALL_AOIS_FETCH_SUCCESS:
    console.log('ALL_AOIS_FETCH_SUCCESS');
    console.log(action.payload);
      return { ...state, allAoisList: action.payload };

    case GZ_SELECTED:
      console.log(action.payload);
      return { ...state, currentGzId: action.payload.id, currentGZName: action.payload.name, currentGZBbox: action.payload.bbox };

    case LOADING_GEOZONES_DATA:
      return { ...state, loading: action.payload };

    case LOADING_DATA:
      return { ...state, loading: action.payload };

    case AOI_LIST_FETCH_ASYNC:
      return { ...state, loading: false, currentAoiList: state.allAoisList[action.payload] };

    case UPDATE_PROGRESS:
      return { ...state, fetchedImages: state.fetchedImages+1, fetchImagesProgress: (state.fetchedImages/state.fetchImagesTotal)};

    case UPDATE_TOTAL:
      return { ...state, fetchImagesTotal: action.payload};

    case SET_DOWNLOAD_STATUS:
      return { ...state, isDownloading: action.payload};

    case UPDATE_INDEX_OBS: {

    const { newKey, oldKey, aoiId } = action.payload;
    const obs = { ...state.allAoisList[state.currentGzId][aoiId].obs[oldKey] }
    obs.key = newKey;
    return { ...state,
            allAoisList: {
              ...state.allAoisList,
              [state.currentGzId]: {
                ...state.allAoisList[state.currentGzId],
                [aoiId]: {
                  ...state.allAoisList[state.currentGzId][aoiId],
                  obs: {
                    ...state.allAoisList[state.currentGzId][aoiId].obs,
                    [newKey]: obs
                  }
                }
              }
            }
          };
    }
    case OBS_DELETE: {
          const { key, currentAoiId } = action.payload;
          const newObs = { ...state.allAoisList[state.currentGzId][currentAoiId].obs };
          delete newObs[key];
          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: newObs
                      }
                    }
                  }
                };
    }
    case AOI_DELETE: {
      const key = action.payload;
      const newAOIList = { ...state.allAoisList };
      delete newAOIList[state.currentGzId][key];
      return { ...state, allAoisList: newAOIList };
    }
    case ADD_NEW_OBS: {
          const { newObs, currentAoiId } = action.payload;

          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: {
                          ...state.allAoisList[state.currentGzId][currentAoiId].obs,
                          [newObs.key]: newObs
                        }
                      }
                    }
                  }
                };
    }

    case UPDATE_OBS_ALLAOI: {
          const { updatedObs, currentAoiId } = action.payload;

          return { ...state,
                  allAoisList: {
                    ...state.allAoisList,
                    [state.currentGzId]: {
                      ...state.allAoisList[state.currentGzId],
                      [currentAoiId]: {
                        ...state.allAoisList[state.currentGzId][currentAoiId],
                        obs: {
                          ...state.allAoisList[state.currentGzId][currentAoiId].obs,
                          [updatedObs.key]: updatedObs
                        }
                      }
                    }
                  }
                };
    }

    case AOI_MODAL_VISIBLE:
      return { ...state, createAOIModalVisible: action.payload};

    case UPDATE_OBS_IMAGES: {
      console.debug('UPDATE_OBS_IMAGES');
      const { obsKey, aoiId, gzId, newImageList } = action.payload;
      // const list = state.allAoisList allAoisList[gzId][aoiId].obs[obsKey].images : images
      return { ...state,
              allAoisList: {
                ...state.allAoisList,
                [gzId]: {
                  ...state.allAoisList[gzId],
                  [aoiId]: {
                    ...state.allAoisList[gzId][aoiId],
                    obs: {
                      ...state.allAoisList[gzId][aoiId].obs,
                      [obsKey]: {
                        ...state.allAoisList[gzId][aoiId].obs[obsKey],
                        images: newImageList
                      }
                    }
                  }
                }
              }
            };
    }
    case CLEAR_FETCHED_IMAGES:
      return { ...state, fetchedImages: 0, fetchImagesProgress: 0};

    case UPDATE_OBS_TOSYNC: {
    console.debug('UPDATE_OBS_TOSYNC', action.payload);
      let { sobsKey, saoiId, sgzId, sync } = action.payload;
      // const list = state.allAoisList allAoisList[gzId][aoiId].obs[obsKey].images : images
      return { ...state,
              allAoisList: {
                ...state.allAoisList,
                [sgzId]: {
                  ...state.allAoisList[sgzId],
                  [saoiId]: {
                    ...state.allAoisList[sgzId][saoiId],
                    obs: {
                      ...state.allAoisList[sgzId][saoiId].obs,
                      [sobsKey]: {
                        ...state.allAoisList[sgzId][saoiId].obs[sobsKey],
                        toSync: sync
                      }
                    }
                  }
                }
              }
            };
    }
    case offlineActionTypes.FETCH_OFFLINE_MODE:
      return { ...state, loading: false, currentAoiList: state.allAoisList[state.currentGzId] };

    default:
      return state;
  }
};
