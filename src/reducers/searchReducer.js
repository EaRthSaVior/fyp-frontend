import { UPDATE_SEARCH_TERM, UPDATE_FILTER_OPTIONS, RESET_SEARCH_STATE  } from '../actionTypes';

const initialState = {
  searchTerm: '',
  filterOptions: {
    sort: 'Newest',
    type: 'All',
    language: 'All',
    numQues: 'All'
  }
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    case UPDATE_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: action.payload
      };
      case RESET_SEARCH_STATE:
        return initialState;
    default:
      return state;
  }
};

export default searchReducer;