export const UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM';
export const UPDATE_FILTER_OPTIONS = 'UPDATE_FILTER_OPTIONS';
export const UPDATE_GRID_CARD_STATE = 'UPDATE_GRID_CARD_STATE';
export const UPDATE_PAGE_REF = 'UPDATE_PAGE_REF';
export const RESET_GRID_CARD_STATE = 'RESET_GRID_CARD_STATE';
export const RESET_SEARCH_STATE = 'RESET_SEARCH_STATE';
export const UPDATE_ACTIVE_TAB = 'UPDATE_ACTIVE_TAB';
// Action creators
// searchActions.js
export const updateSearchTerm = (searchTerm) => {
  return {
    type: UPDATE_SEARCH_TERM,
    payload: searchTerm
  };
};

export const updateFilterOptions = (filterOptions) => {
  return {
    type: UPDATE_FILTER_OPTIONS,
    payload: filterOptions
  };
};

// gridCardActions.js
export const updateGridCardState = (cards) => {
  return {
    type: UPDATE_GRID_CARD_STATE,
    payload: cards
  };
};

export const updatePageRef = (pageRef) => ({
  type: UPDATE_PAGE_REF,
  payload: pageRef,
});

// actions.js

  export const resetGridCardState = () => {
    return {
      type: RESET_GRID_CARD_STATE
    };
  };

// actions.js
export const resetSearchState = () => {
  return {
    type: RESET_SEARCH_STATE
  };
};
export const updateActiveTab = (activeTabData) => {
  return {
    type: UPDATE_ACTIVE_TAB,
    payload: activeTabData,
  };
};