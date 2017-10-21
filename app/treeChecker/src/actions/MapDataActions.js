import axios from 'axios';
import RNFS from 'react-native-fs';
import { NavigationActions } from 'react-navigation';
import {
  REFRESH_CURRENT_AOI,
  AOI_ID_SELECTED,
  OBS_SELECTED,
  SET_URL_MAP_OFFLINE,
  OBS_UPDATE,
  OBS_RESET,
  OBS_CREATE,
  ADD_NEW_OBS,
  SET_SAVING_STATUS,
  SET_SYNC_STATUS,
  CHECK_STATE,
  UPDATE_OBS_IMAGES,
  UPDATE_OBS_TOSYNC,
  OBS_SAVE_SUCCESS,
  OBS_DELETE,
  UPDATE_INDEX_OBS,
  OBS_SELECTED_BY_INDEX,
  UPDATE_OBS_AOI,
  UPDATE_OBS_ALLAOI
} from './types';

import {
  URL_UPLOAD_IMG,
  URL_UPDATE_OBS,
  URL_ADD_IMAGE,
  URL_API_AOIS
} from './urls';


export const setUrlMapOffline = ({ urlMapOffline, serverStarted, server}) => {
  console.log(`urlMapOffline ${urlMapOffline}`);
  return {
    type: SET_URL_MAP_OFFLINE,
    payload: { urlMapOffline, serverStarted, server }
  };
};

export const aoiIdUpdate = ({ currentAoiId }) => {
  console.log(`currentAoiId ${currentAoiId}`);
  return {
    type: AOI_ID_SELECTED,
    payload: currentAoiId
  };
};

export const refreshSelectedObs = ( currentObs ) => {
  console.debug('refreshSelectedObs', currentObs);
  return {
    type: OBS_SELECTED,
    payload: currentObs
  };
};

export const refreshSelectedAoi = ( currentAoi ) => {
  console.debug('refreshSelectedAoi', currentAoi);
  return {
    type: REFRESH_CURRENT_AOI,
    payload: currentAoi
  };
};

export const refreshSelectedAoiByIndex = ( index ) => {
  return {
    type: OBS_SELECTED_BY_INDEX,
    payload: index
  };
};

export const obsUpdate = ({ prop, value }) => {
  return {
    type: OBS_UPDATE,
    payload: { prop, value }
  };
};

export const obsResetForm = () => {
  return {
    type: OBS_RESET,
    payload: {}
  };
};

export const obsCreate = (pos) => {
  return {
    type: OBS_CREATE,
    payload: pos
  };
};

async function uploadImage(token, img, obsKey, latitude, longitude) {

  console.debug('---------------------------------------------------------------uploadimage....');

  const instance = axios.create({
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type':'application/json'
    }
  });

    // RNFS.readFile(f1, 'utf8').then(contents => {
    //    this.assert('Read F1', contents, 'foo © bar 𝌆 bazbaz 𝌆 bar © foo');
    //  });

    let contents = await RNFS.readFile(img.url, 'base64');

    console.debug('contents', `data:image/${img.type};base64,${contents}`);

    let { data } = await instance.post(URL_UPLOAD_IMG, {
      image: `data:image/${img.type};base64,${contents}` //img.data
    });

    console.debug('imatge pujada:', data);

    let response = await instance.post(URL_ADD_IMAGE, {
      survey_data: obsKey,
      latitude: latitude,
      longitude: longitude,
      compass: img.compass,
      url: data.url
    });
    //
    console.debug('response imatge', response);
    console.debug('${RNFS.ExternalDirectoryPath}${data.url}', `${RNFS.ExternalDirectoryPath}/pictures/static${data.url}`);
    let wr = await RNFS.writeFile(`${RNFS.ExternalDirectoryPath}/pictures${data.url}`, contents, 'base64');
    //let wr = await RNFS.copyFile(img.url, `${RNFS.ExternalDirectoryPath}/pictures/static${data.url}`);
    console.debug('---------------------------------------------------------------uploadimage....');
    return ({
      key: response.data.key,
      url: data.url
    });

}

async function updateImages(dispatch, token, obsKey, aoiId, gzId, images, position) {

  try {
    console.debug('updateImages aoiId', aoiId);
    // console.debug('position', position);

    const newImageList = [];
    let newImage = {};
    const newImgKeys = [];

    for (let img of images) {
      console.debug('img', img);
      if (img.compass) {
        newImage = await uploadImage(token, img, obsKey, position.latitude, position.longitude);
        console.debug('newImage', newImage);
        newImageList.push(newImage);
        newImgKeys.push(newImage.key);
      }else{
        newImageList.push(img);
        newImgKeys.push(img.key);
      }
    }
    console.debug('newImageList', newImageList);

    //currentObs.images = newImageList;
    // dispatch({ type: CHECK_STATE, payload: {} });
    dispatch({ type: UPDATE_OBS_IMAGES, payload: {obsKey, aoiId, gzId, newImageList: newImageList} });
    // dispatch({ type: CHECK_STATE, payload: {} });

    return {success: true, newImgKeys};

  }catch(error) {

    console.debug('error:', error);
    return {success: false, newImgKeys: []};
  }
}

async function updateData(token, obsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, compass, images) {

  try {
    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

      var newData = {
          name: name,
          tree_specie: tree_specie.key,
          crown_diameter: crown_diameter.key,
          canopy_status: canopy_status.key,
          comment: comment,
          longitude: position.longitude,
          latitude: position.latitude,
          compass: compass//,
          //images: currentObs.newImgKeys//TODO
      }
      if(images.success){
        newData.images = images.newImgKeys;
      }

      let response = await instance.put(`${URL_UPDATE_OBS}${obsKey}/`, newData);

      if (response.status == 200 ) return true;
      else  return false;

  } catch(error) {
    console.debug('error:', error);
    return false;
  }

}

export const obsUpdateSaveServer = ( currentObsKey, currentAoiId, currentGzId, name, tree_specie, crown_diameter, canopy_status, comment, position, images, compass, token ) => {

  async function thunk(dispatch) {

    console.debug('*********obsUpdateSaveServer');
    dispatch({ type: SET_SYNC_STATUS, payload: true });
    try {

      let successImgages = await updateImages(dispatch, token, currentObsKey, currentAoiId, currentGzId, images, position);
      let successData = await updateData(token, currentObsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, compass, successImgages);

      const sync = (successData && successImgages.success ? false : true);

      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync} });
      dispatch({ type: CHECK_STATE, payload: {} });
      dispatch({ type: SET_SYNC_STATUS, payload: false });
      //TODO show toast message
      //TODO Update les altres llistes de l'estat no?

    } catch(e) {
      console.debug(e);
      //TODO show toast??
      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: true} });
      dispatch({ type: SET_SYNC_STATUS, payload: false });
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true, // By passing true, your thunk will be enqueued on offline mode
    dismiss: [] // Array of actions which, once dispatched, will trigger a dismissal from the queue
  }
  return thunk;
};

export const obsUpdateSaveLocal = ( currentObs, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, images ) => {

  async function thunk(dispatch) {
    console.debug('obsUpdateSaveLocal', currentObs);
    dispatch({ type: SET_SAVING_STATUS, payload: true });

    // const updatedObs = {
    //   name: name,
    //   tree_specie: tree_specie,
    //   crown_diameter: crown_diameter,
    //   canopy_status: canopy_status,
    //   comment: comment,
    //   position: position,
    //   images: images,
    //   toSync: true//TODO revisar
    // };

    const updatedObs = { ...currentObs };

    updatedObs.name = name;
    updatedObs.tree_specie = tree_specie;
    updatedObs.crown_diameter = crown_diameter;
    updatedObs.canopy_status = canopy_status;
    updatedObs.comment = comment;
    updatedObs.position.latitude = position.latitude;
    updatedObs.position.longitude = position.longitude;
    updatedObs.images = images;
    updatedObs.toSync = true;//TODO revisar

    dispatch({ type: OBS_SELECTED, payload: updatedObs });
    dispatch({ type: UPDATE_OBS_AOI, payload: updatedObs.key });
    dispatch({ type: UPDATE_OBS_ALLAOI, payload: { updatedObs, currentAoiId} });


    dispatch({ type: CHECK_STATE, payload: {} });
    dispatch({ type: SET_SAVING_STATUS, payload: false });
    // dispatch({ type: OBS_SAVE_SUCCESS, payload: {} });

  };
  return thunk;
};



async function addData(token, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, compass) {

  try {
    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

      var newData = {
          name: name,
          tree_specie: tree_specie.key,
          crown_diameter: crown_diameter.key,
          canopy_status: canopy_status.key,
          comment: comment,
          longitude: position.longitude,
          latitude: position.latitude,
          compass: compass
      }

      let response = await instance.post(`${URL_API_AOIS}${currentAoiId}/observations/`, newData);
      if (response.status == 200 ) return {success: true, obsKey: response.data.key};
      else return {success: false, obsKey: ''};

  } catch(error) {
    console.debug('error:', error);
    return false;
  }

}

export const obsCreateSaveServer = ( currentObsKey, currentAoiId, currentGzId, name, tree_specie, crown_diameter, canopy_status, comment, position, images, compass, token ) => {

  async function thunk(dispatch) {

    console.debug('*********obsUpdateSaveServer');

    try {

      let successData = await addData(token, currentAoiId, name, tree_specie, crown_diameter, canopy_status, comment, position, compass);


      if(successData.success){

        dispatch({ type: UPDATE_INDEX_OBS, payload: { newKey: successData.obsKey, oldKey: currentObsKey, aoiId: currentAoiId } });
        dispatch({ type: OBS_DELETE, payload: { key: currentObsKey, currentAoiId} });

        let successImgages = await updateImages(dispatch, token, successData.obsKey, currentAoiId, currentGzId, images, position);

        if(successImgages.success){
            dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: successData.obsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: false} });
        }
      }

      dispatch({ type: CHECK_STATE, payload: {} });

      //TODO show toast message
      //TODO Update les altres llistes de l'estat no?

    } catch(e) {
      console.debug(e);
      //TODO show toast??
      dispatch({ type: UPDATE_OBS_TOSYNC, payload: {sobsKey: currentObsKey, saoiId: currentAoiId, sgzId: currentGzId, sync: true} });
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true, // By passing true, your thunk will be enqueued on offline mode
    dismiss: [] // Array of actions which, once dispatched, will trigger a dismissal from the queue
  }
  return thunk;
};

export const obsCreateSaveLocal = ( obsKey, name, tree_specie, crown_diameter, canopy_status, comment, position, images, currentAoiId ) => {

  async function thunk(dispatch) {
    console.debug('obsCreateSaveLocal.............');
    dispatch({ type: SET_SAVING_STATUS, payload: true });


    const newObs = {};
    newObs.key = obsKey;
    newObs.name = name;
    newObs.tree_specie = tree_specie;
    newObs.crown_diameter = crown_diameter;
    newObs.canopy_status = canopy_status;
    newObs.comment = comment;
    newObs.position = position;
    newObs.images = images;
    newObs.toSync = true;//TODO revisar


    dispatch({ type: ADD_NEW_OBS, payload: {newObs, currentAoiId} });
    dispatch({ type: CHECK_STATE, payload: {} });
    dispatch({ type: SET_SAVING_STATUS, payload: false });
    // dispatch({ type: OBS_SAVE_SUCCESS, payload: {} });

  };
  return thunk;
};

export const deleteObsServer = ( currentObs, currentAoiId, token ) => {
  async function thunk(dispatch) {
    console.debug('*********deleteObsServer');

    try {
      const instance = axios.create({
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type':'application/json'
        }
      });

      let response = await instance.delete(`${URL_UPDATE_OBS}${currentObs.key}/`);
      console.debug('response', response);
      if (response.status !== 200 ){
        console.debug('No esborrada be! Afegim localment un altre cop!!!');
        dispatch({ type: ADD_NEW_OBS, payload: {currentObs, currentAoiId} });
        //TODO tb cal actualitzar el mapa i tornar afegir la obs
      };
      dispatch({ type: CHECK_STATE, payload: {} });
      //TODO show toast message
      //TODO Update les altres llistes de l'estat no?

    } catch(e) {
      console.debug(e);
      //TODO show toast??
      console.debug('No esborrada be! Afegim localment un altre cop!!!');
      dispatch({ type: ADD_NEW_OBS, payload: {currentObs, currentAoiId} });
    }
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true, // By passing true, your thunk will be enqueued on offline mode
    dismiss: [] // Array of actions which, once dispatched, will trigger a dismissal from the queue
  }
  return thunk;
};

export const deleteObsLocal = ( obsKey, currentAoiId ) => {

  console.debug('deleteObsLocal.............');
  return {
    type: OBS_DELETE,
    payload: { key: obsKey, currentAoiId}
  };
};
