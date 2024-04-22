import { MainLayout, WrapLayout } from '~/layouts';
import {
    AccountDetail,
    AccountVerification,
    Accounts,
    Activation,
    ChangePassword,
    CreateProduct,
    CreateVariant,
    ProductDetail,
    Products,
    Signin,
    UnderDevelopment,
} from '~/pages';

export const publicRoutes = [
    { path: '/', protected: true, page: UnderDevelopment, layout: MainLayout },
    { path: '/change-password/:userId', page: ChangePassword, layout: WrapLayout },
    { path: '/sign-in', page: Signin, layout: WrapLayout },
    { path: '/accounts', authority: 'admin', protected: true, page: Accounts, layout: MainLayout },
    { path: '/accounts/detail/:username', protected: true, page: AccountDetail, layout: MainLayout },
    { path: '/activation/:userId', page: Activation, layout: WrapLayout },
    { path: '/verify-account/:token', page: AccountVerification, layout: WrapLayout },
    { path: '/products', protected: true, page: Products, layout: MainLayout },
    { path: '/products/detail/:productId', protected: true, page: ProductDetail, layout: MainLayout },
    { path: '/products/create-product', protected: true, page: CreateProduct, layout: MainLayout },
    { path: '/products/:productId/variant-new', protected: true, page: CreateVariant, layout: MainLayout },
    { path: '/orders', authority: 'admin', protected: true, page: UnderDevelopment, layout: MainLayout },
];
