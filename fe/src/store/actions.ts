import { ProductDTO } from '@/types/product.types';
import {
  ADD_CHECKED_ROW,
  CLEAR_CHECKED_ROWS,
  DELETE_CHECKED_ROW,
  SET_CLEARED_IMAGE,
  DELETE_CLEARED_IMAGE,
  ADD_PRODUCT_CHANGES,
  DELETE_PRODUCT_CHANGES,
  SET_PRODUCT_DETAIL,
  SET_CONFIRM_CLEAR_IMAGE,
} from './constants';
import { StoreAction } from './reducer';

export const setProductDetail = (payload: Partial<ProductDTO>): StoreAction => ({
  type: SET_PRODUCT_DETAIL,
  payload,
});

export const setConfirmClearImage = (payload: boolean): StoreAction => ({
  type: SET_CONFIRM_CLEAR_IMAGE,
  payload,
});

export const deleteProductChanges = (): StoreAction => ({
  type: DELETE_PRODUCT_CHANGES,
});

export const addProductChanges = (propName: string, value: any): StoreAction => ({
  type: ADD_PRODUCT_CHANGES,
  payload: { propName, value },
});

export const addCheckedRow = (payload: string): StoreAction => ({
  type: ADD_CHECKED_ROW,
  payload,
});

export const deleteCheckedRow = (payload: string): StoreAction => ({
  type: DELETE_CHECKED_ROW,
  payload,
});

export const clearCheckedRows = (): StoreAction => ({
  type: CLEAR_CHECKED_ROWS,
});

export const setClearedImage = (payload: string): StoreAction => ({
  type: SET_CLEARED_IMAGE,
  payload,
});

export const deleteClearedImage = (): StoreAction => ({
  type: DELETE_CLEARED_IMAGE,
});
