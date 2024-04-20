export const SET_USER_AUTH = 'set_user_auth';
export const ADD_CHECKED_ROW = 'add_checked_row';
export const DELETE_CHECKED_ROW = 'delete_checked_row';
export const CLEAR_CHECKED_ROWS = 'clear_checked_rows';
export const SET_CLEARED_IMAGE = 'set_cleared_image';
export const DELETE_CLEARED_IMAGE = 'delete_cleared_image';
export const ADD_PRODUCT_CHANGES = 'add_product_changes';
export const DELETE_PRODUCT_CHANGES = 'delete_product_changes';
export const SET_CANCEL_PRODUCT_CHANGES_OPTION = 'set_cancel_product_changes_option';
export const CLEAR_CANCEL_PRODUCT_CHANGES_OPTION = 'clear_cancel_product_changes_option';
export const SET_PRODUCT_DETAIL = 'set_product_detail';

export const sampleProductDetail = {
    productId: 1,
    name: 'Sample name',
    provider: 'default',
    category: 'default',
    description: '',
    thumbnails: [],
    salePrice: 0,
    comparedPrice: 0,
    sku: '',
    barcode: '',
    baseUnit: '',
    properties: [
        {
            name: 'Sample name',
            tags: ['sample tag'],
        },
    ],
    variants: [1, 2, 3],
};
