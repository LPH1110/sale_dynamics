import {
    ADD_CHECKED_ROW,
    DELETE_CHECKED_ROW,
    CLEAR_CHECKED_ROWS,
    SET_CLEARED_IMAGE,
    DELETE_CLEARED_IMAGE,
    ADD_PRODUCT_CHANGES,
    DELETE_PRODUCT_CHANGES,
    SET_PRODUCT_DETAIL,
    sampleProductDetail,
    SET_CONFIRM_CLEAR_IMAGE,
} from './constants';

const initState = {
    checkedRows: [],
    clearedImage: '',
    productChanges: {},
    confirmedClearImage: false,
    productDetail: sampleProductDetail,
};

function reducer(state, action) {
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
                },
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
            let newCheckedRows = state.checkedRows.filter((id) => id !== action.payload);
            return {
                ...state,
                checkedRows: newCheckedRows,
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
            throw new Error('Invalid actions...');
    }
}

export { initState };
export default reducer;
