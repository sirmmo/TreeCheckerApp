  import {
    SET_CANOPY_LIST,
    SET_CROWN_LIST,
    SET_TREE_SPECIES_LIST
  } from '../actions/types';

  const INITIAL_STATE = {
    canopyList: [],
    crownList: [],
    treeSpeciesList: []
  };

  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

      case SET_CANOPY_LIST:
        console.debug('SET_CANOPY_LIST', action.payload);
        return { ...state, canopyList: action.payload };

      case SET_CROWN_LIST:
        return { ...state, crownList: action.payload };

      case SET_TREE_SPECIES_LIST:
        return { ...state, treeSpeciesList: action.payload };

      default:
        return state;
    }
  };
