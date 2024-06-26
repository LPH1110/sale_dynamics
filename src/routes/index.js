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
    OrderRefund,
    Orders,
    ProductDetail,
    Products,
    Signin,
    UnderDevelopment,
    Customers,
    Dashboard,
    CustomerDetail,
} from '~/pages';

export const publicRoutes = [
    { path: '/', protected: true, page: Dashboard, layout: MainLayout },
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
    { path: '/orders/detail/:orderId/refund', protected: true, page: OrderRefund, layout: MainLayout },
    { path: '/customers/detail/:phone', protected: true, page: CustomerDetail, layout: MainLayout },
    { path: '/customers', protected: true, page: UnderDevelopment, layout: MainLayout },
];
