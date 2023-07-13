import { UPDATE_GRID_CARD_STATE,UPDATE_PAGE_REF , RESET_GRID_CARD_STATE,UPDATE_ACTIVE_TAB} from '../actionTypes';

const initialState = {
  cards: [],
  pageRef: 1,
  activeTabData: ""
};
const gridCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRID_CARD_STATE:
      return {
        ...state,
        cards: action.payload,
      };
    case UPDATE_PAGE_REF:
      return {
        ...state,
        pageRef: action.payload,
      };
      case UPDATE_ACTIVE_TAB:
        return {
          ...state,
          activeTabData: action.payload,
        };
      case RESET_GRID_CARD_STATE:
        return initialState;
    default:
      return state;
  }
};

export default gridCardReducer;