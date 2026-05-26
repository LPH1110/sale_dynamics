import { ProductDTO } from '@/types/product.types';
import {
  ADD_CHECKED_ROW,
  DELETE_CHECKED_ROW,
  CLEAR_CHECKED_ROWS,
  SET_CLEARED_IMAGE,
  DELETE_CLEARED_IMAGE,
  ADD_PRODUCT_CHANGES,
  DELETE_PRODUCT_CHANGES,
  SET_PRODUCT_DETAIL,
  SET_CONFIRM_CLEAR_IMAGE,
  sampleProductDetail,
} from './constants';

export interface StoreState {
  checkedRows: string[];
  clearedImage: string;
  productChanges: Record<string, any>;
  confirmedClearImage: boolean;
  productDetail: ProductDTO;
}

export const initState: StoreState = {
  checkedRows: [],
  clearedImage: '',
  productChanges: {},
  confirmedClearImage: false,
  productDetail: sampleProductDetail,
};

export type StoreAction =
  | { type: typeof SET_CONFIRM_CLEAR_IMAGE; payload: boolean }
  | { type: typeof SET_PRODUCT_DETAIL; payload: Partial<ProductDTO> }
  | { type: typeof DELETE_PRODUCT_CHANGES }
  | { type: typeof ADD_PRODUCT_CHANGES; payload: { propName: string; value: any } }
  | { type: typeof ADD_CHECKED_ROW; payload: string }
  | { type: typeof DELETE_CHECKED_ROW; payload: string }
  | { type: typeof CLEAR_CHECKED_ROWS }
  | { type: typeof SET_CLEARED_IMAGE; payload: string }
  | { type: typeof DELETE_CLEARED_IMAGE };

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case SET_CONFIRM_CLEAR_IMAGE:
      return {
        ...state,
        confirmedClearImage: action.payload,
      };
    case SET_PRODUCT_DETAIL:
      return {
        ...state,
        productDetail: {
          ...state.productDetail,
          ...action.payload,
        } as ProductDTO,
      };
    case DELETE_PRODUCT_CHANGES:
      return {
        ...state,
        productChanges: {},
      };
    case ADD_PRODUCT_CHANGES:
      return {
        ...state,
        productChanges: {
          ...state.productChanges,
          [action.payload.propName]: action.payload.value,
        },
      };
    case ADD_CHECKED_ROW:
      return {
        ...state,
        checkedRows: [...state.checkedRows, action.payload],
      };
    case DELETE_CHECKED_ROW:
      return {
        ...state,
        checkedRows: state.checkedRows.filter((id) => id !== action.payload),
      };
    case CLEAR_CHECKED_ROWS:
      return {
        ...state,
        checkedRows: [],
      };
    case SET_CLEARED_IMAGE:
      return {
        ...state,
        clearedImage: action.payload,
      };
    case DELETE_CLEARED_IMAGE:
      return {
        ...state,
        clearedImage: '',
      };
    default:
      return state;
  }
}

export default reducer;
