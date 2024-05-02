import {
    SET_USER_AUTH,
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

export const setProductDetail = (payload) => {
    return {
        type: SET_PRODUCT_DETAIL,
        payload,
    };
};

export const setConfirmClearImage = (payload) => {
    return {
        type: SET_CONFIRM_CLEAR_IMAGE,
        payload,
    };
};

export const deleteProductChanges = (payload) => {
    return {
        type: DELETE_PRODUCT_CHANGES,
        payload,
    };
};

export const addProductChanges = ({ propName, value }) => {
    return {
        type: ADD_PRODUCT_CHANGES,
        payload: { propName, value },
    };
};

export const setUserAuth = (payload) => {
    return {
        type: SET_USER_AUTH,
        payload,
    };
};

export const addCheckedRow = (payload) => {
    return {
        type: ADD_CHECKED_ROW,
        payload,
    };
};

export const deleteCheckedRow = (payload) => {
    return {
        type: DELETE_CHECKED_ROW,
        payload,
    };
};

export const clearCheckedRows = (payload) => {
    return {
        type: CLEAR_CHECKED_ROWS,
        payload,
    };
};

export const setClearedImage = (payload) => {
    return {
        type: SET_CLEARED_IMAGE,
        payload,
    };
};

export const deleteClearedImage = (payload) => {
    return {
        type: DELETE_CLEARED_IMAGE,
        payload,
    };
};
