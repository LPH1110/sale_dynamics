import { MainLayout, WrapLayout } from '~/layouts';
import {
    AccountDetail,
    AccountVerification,
    Accounts,
    Activation,
    ChangePassword,
    CreateOrder,
    CreateProduct,
    CreateVariant,
    OrderDetail,
    Orders,
    ProductDetail,
    Products,
    Signin,
    UnderDevelopment,
} from '~/pages';

export const publicRoutes = [
    { path: '/', protected: true, page: UnderDevelopment, layout: MainLayout },
    { path: '/change-password/:username', protected: true, page: ChangePassword, layout: WrapLayout },
    { path: '/sign-in', page: Signin, layout: WrapLayout },
    { path: '/accounts', authority: 'admin', protected: true, page: Accounts, layout: MainLayout },
    { path: '/accounts/detail/:username', protected: true, page: AccountDetail, layout: MainLayout },
    { path: '/activation/:userId', page: Activation, layout: WrapLayout },
    { path: '/verify-account/:token', page: AccountVerification, layout: WrapLayout },
    { path: '/products', protected: true, page: Products, layout: MainLayout },
    { path: '/products/detail/:barcode', protected: true, page: ProductDetail, layout: MainLayout },
    { path: '/products/create-product', protected: true, page: CreateProduct, layout: MainLayout },
    { path: '/products/:productId/variant-new', protected: true, page: CreateVariant, layout: MainLayout },
    { path: '/orders', protected: true, page: Orders, layout: MainLayout },
    { path: '/orders/create-new', protected: true, page: CreateOrder, layout: MainLayout },
    { path: '/orders/detail/:orderId', protected: true, page: OrderDetail, layout: MainLayout },
];
