export const SET_USER_AUTH = 'set_user_auth';
export const ADD_CHECKED_ROW = 'add_checked_row';
export const DELETE_CHECKED_ROW = 'delete_checked_row';
export const CLEAR_CHECKED_ROWS = 'clear_checked_rows';
export const SET_CLEARED_IMAGE = 'set_cleared_image';
export const DELETE_CLEARED_IMAGE = 'delete_cleared_image';
export const ADD_PRODUCT_CHANGES = 'add_product_changes';
export const DELETE_PRODUCT_CHANGES = 'delete_product_changes';
export const SET_PRODUCT_DETAIL = 'set_product_detail';
export const SET_CONFIRM_CLEAR_IMAGE = 'set_confirm_clear_image';

export const sampleProductDetail = {
    id: 0,
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

export const propertyNames = ['materials', 'colors', 'size'];

// export const dateRangeKeys = [
//     'Today',
//     'Yesterday',
//     '7 days ago',
//     '30 days ago',
//     'This month',
//     'Previous month',
//     'This quarter',
//     'Previous quarter',
//     'This year',
//     'Previous year',
//     'Optional',
// ];

export const dateRangeKeys = {
    Today: {
        startDate: new Date(),
        endDate: new Date(),
    },
    Yesterday: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    '7 days ago': {
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    },
    '30 days ago': {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
    },
    'This month': {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
    },
    'Previous month': {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
    'This quarter': {
        startDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1),
        endDate: new Date(),
    },
    'Previous quarter': {
        startDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 - 3, 1),
        endDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 0),
    },
    'This year': {
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date(),
    },
    'Previous year': {
        startDate: new Date(new Date().getFullYear() - 1, 0, 1),
        endDate: new Date(new Date().getFullYear(), 0, 0),
    },
    Optional: {
        startDate: null,
        endDate: null,
    },
};
