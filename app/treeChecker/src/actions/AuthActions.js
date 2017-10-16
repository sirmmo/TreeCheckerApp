import { AsyncStorage } from 'react-native';
import axios from 'axios';
//import { geoZonesFetch } from './GeoZonesActions';
import RNFS from 'react-native-fs';

import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT,
  UPDATE_TOKEN,
  REFRESHING_TOKEN,
  GEOZONES_FETCH_SUCCESS,
  SET_CANOPY_LIST,
  SET_CROWN_LIST,
  SET_TREE_SPECIES_LIST,
  ALL_AOIS_FETCH_SUCCESS,
  UPDATE_USER_DATA
} from './types';

import {
  URL_LOGIN,
  URL_CANOPIES,
  URL_CROWNS,
  URL_TREES,
  URL_GET_USER_DATA,
  URL_GZS,
  URL_STATIC,
  URL_STATIC_GZ,
  URL_AOI_SUFFIX
} from './urls';

export const usernameChanged = (text) => {
  return {
    type: USERNAME_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};


export const logout = () => {
  return {
      type: LOGOUT,
      payload: ''
  }
}

export default function authMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === 'function') {
      let state = getState();

      if(state) {
        console.debug('*************************authMiddleware', state.network);
        if(state.network.isConnected && state.auth && isExpired(state.auth.token_timestamp)) {
          // refreshToken(dispatch, state).then(res => {
          //   console.debug('refreshtoken FINISHED!');
          //     next(action);
          // });
          // if(!state.refres) {
            return refreshToken(dispatch, state).then(() => {
              console.debug('next action!');
              next(action)
            }).catch( err => {
              //TODO fer un show toast recomanant fer log out i log in again
              console.error('token no acutlitzat, fer log out');
            });
          // } else {
          //   return state.refreshTokenPromise.then(() => next(action));
          // }
        }
      }
    }
    return next(action);
  }
}

function isExpired(expires_date) {
  let currentTime = Date.now();
  console.debug('expires_date', expires_date);
  // console.debug('expires_date', expires_date + 3600000);
  console.debug('currentTime', currentTime);
  console.debug('**********isExpired: ', (currentTime > expires_date));
  // return true;
  return (currentTime > expires_date) && expires_date !== -1;
}

function refreshToken(dispatch, state) {
  console.debug('refrestoken..................2');

  let refreshTokenPromise = axios.post(URL_LOGIN, {
    email: state.auth.username,
    password: state.auth.password
  }).then(resp => {
    console.debug('resp', resp);
    console.debug('resp.data.token', resp.data.token);
    dispatch({
      type: UPDATE_TOKEN,
      payload: {token: resp.data.token, token_timestamp: Date.now() }
    });

    // dispatch({
    //   type: types.DONE_REFRESHING_TOKEN
    // });

    // dispatch({
    //   type: types.LOGIN_SUCCESS,
    //   data: resp
    // });
    // dispatch({
    //   type: types.SET_HEADER,
    //   header: {
    //     Authorization: resp.token_type + ' ' + resp.access_token,
    //     Instance: state.currentInstance.id
    //   }
    // });
    return resp ? Promise.resolve(resp) : Promise.reject({
        message: 'could not refresh token'
    });
  }).catch(ex => {
    console.debug('exception refresh_token', ex);
    //loginUserFail(dispatch);
    return Promise.reject({
        message: 'could not refresh token'
    });
    // dispatch({
    //   type: types.DONE_REFRESHING_TOKEN
    // });
    // dispatch({
    //   type: types.LOGIN_FAILED,
    //   exception: ex
    // });
  });

  // dispatch({
  //   type: REFRESHING_TOKEN,
  //   // we want to keep track of token promise in the state so that we don't     try to refresh the token again while refreshing is in process
  //   payload: true
  // });

  return refreshTokenPromise;
}

async function refreshToken2(dispatch, state){
  const time = Date.now();
  try{
    let { data } = await axios.post(URL_LOGIN, {
      email: state.auth.username,
      password: state.auth.password
    });

    dispatch({
      type: UPDATE_TOKEN,
      payload: {token: data.token, token_timestamp: time }
    });
    Promise.resolve(true);

  } catch (error) {
    console.debug(error);
    loginUserFail(dispatch);
    Promise.resolve(false);
  }
}

export const loginUser = ({ username, password, navigation }) => {

  async function thunk(dispatch) {
      dispatch({ type: LOGIN_USER });
      const time = Date.now();
      try {
        let { data } = await axios.post(URL_LOGIN, {
          email: username,
          password
        });

        //Carrega inicial de totes les dades
        await prefetchData(data.token, dispatch);
        preFetchFormData(data.token, dispatch);
        preFetchUserData(username, data.token, dispatch);

        loginUserSuccess(dispatch, { username, password, token: data.token, token_timestamp: time  });

        navigation.navigate('walkthrough');
      } catch (error) {
        // console.error(error);
        loginUserFail(dispatch);
      }
    };

    thunk.interceptInOffline = true; // This is the important part
    return thunk; // Return it afterwards
};

const prefetchData = async (token, dispatch) => {

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });
    let data = await instance.get(URL_GZS);
    const geozonesList = data.data;

    const allAoisList = {};

    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/`);
    // await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/static/`);
    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/gz/`);
    await RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/pictures/obs/`);

    for (let gz of geozonesList) {
      console.debug('RNFS.ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
      console.debug(`${URL_STATIC}${gz.image_url}`);

      //TODO ficar les rutes bones
      try {
        let responseImages = await RNFS.downloadFile({
          fromUrl: `${URL_STATIC_GZ}${gz.key}.png`,
          toFile: `${RNFS.ExternalDirectoryPath}/pictures/gz/${gz.key}.png`
        });
      } catch(e) {
        console.debug('error rnfs download file', e);
      }


        try {
          data = await instance.get(`${URL_GZS}${gz.key}${URL_AOI_SUFFIX}`);
          console.log(data.data);
          const list = data.data;
          let gzAoisList = {};
          for (let aoi of list ) {
            let obsList = {};
            for(let o of aoi.obs){
                let imgList = {};
                for(let i of o.images){
                  imgList[i.key] = i;

                  try {
                    let respObsImage = await RNFS.downloadFile({
                      fromUrl: `${URL_STATIC}${i.url}`,
                      toFile: `${RNFS.ExternalDirectoryPath}/pictures${i.url}`
                    });
                  } catch(e) {
                    console.debug('error rnfs download image obs', e);
                  }

                }
                o.images = imgList;
                o.toSync = false;
                obsList[o.key] = o;
            }
            aoi.obs = obsList;
            gzAoisList[aoi.key] = aoi;
          }
          allAoisList[gz.key] = gzAoisList;

        } catch (error) {
          console.error(error);
          allAoisList[gz.key] = [];
        }
    }

    console.debug('allAoisList', allAoisList);
    console.debug('geozonesList', geozonesList);
    dispatch({ type: GEOZONES_FETCH_SUCCESS, payload:geozonesList });
    dispatch({ type: ALL_AOIS_FETCH_SUCCESS, payload: allAoisList });

    // await AsyncStorage.setItem('geozonesList', JSON.stringify(geozonesList));
    // await AsyncStorage.setItem('allAoisList', JSON.stringify(allAoisList));

  } catch(e) {
    console.debug('error prefetchData', e);
  }
}

const preFetchFormData = async (token, dispatch) => {

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

    let response = await instance.get(URL_CANOPIES);
    let list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    console.debug('list can', list);
    dispatch({ type: SET_CANOPY_LIST, payload: list });

    response = await instance.get(URL_CROWNS);
    list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    dispatch({ type: SET_CROWN_LIST, payload: list });

    response = await instance.get(URL_TREES);
    list = {};
    for(let item of response.data){
      list[item.key] = item;
    }
    dispatch({ type: SET_TREE_SPECIES_LIST, payload: list });

  } catch(e) {
    console.debug('Async Not done error:', e);
  }

}

const preFetchUserData = async (username, token, dispatch) => {

  let userData = {
    key: 1,
    name: username,
    username: username,
    email: 'email',
    occupation: '',
    country: {
        key: 1,
        country_code: 'en',
        name: ''
    },
    language: 'en'
  };

  try {

    const instance = axios.create({
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type':'application/json'
      }
    });

    let response = await instance.get(URL_GET_USER_DATA);
    if (response.status === 200) {
      userData = response.data;
    }

    dispatch({ type: UPDATE_USER_DATA, payload: userData });

  } catch(e) {
    console.debug('prefetch user data ERROR', e);
    dispatch({ type: UPDATE_USER_DATA, payload: userData });
  }
}

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, data) => {

  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: data
  });
};


/***Examples no esborrar***/


export const loginUser2 = ({ username, password, navigation }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    console.log(username);
    console.log(password);

    axios.post(URL_LOGIN, {
      username,
      password
    }).then((response) => {
      console.log(response.data);
      loginUserSuccess(dispatch, { username, password, token: response.data.token });
      navigation.navigate('walkthrough');
    }).catch(error => {
        console.error(error);
       loginUserFail(dispatch);
    });
  };
};

export const loginUser3 = ({ username, password, navigation }) => async dispatch => {
    dispatch({ type: LOGIN_USER });

    console.log(username);
    console.log(password);

    try {
      let { data } = await axios.post(URL_LOGIN, {
        username,
        password
      });
      console.debug(data);

      loginUserSuccess(dispatch, { username, password, token: data.token });

      navigation.navigate('walkthrough');
    } catch (error) {
      console.error(error);
      loginUserFail(dispatch);
    }
  };
