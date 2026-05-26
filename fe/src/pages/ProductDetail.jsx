import { Transition } from '@headlessui/react';
import { ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    CalculationUnit,
    GeneralProductInfo,
    InventoryManagement,
    Modal,
    ProductDetailProperties,
    ProductDetailVariants,
    ProductPrice,
    ProductThumbnail,
} from '~/components';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { ProductDetailContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { productService } from '~/services';
import fetchProductDetail from '~/services/products/fetchProductDetail';
import { actions, useStore } from '~/store';
import { authorizeAdmin } from '~/utils';

const ProductDetail = () => {
    const { barcode } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [productDetail, setProductDetail] = useState(null);
    const [productChanged, setProductChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, dispatch] = useStore();
    const { user } = UserAuth();

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e?.preventDefault();
            console.log('Running unload');
        };

        // handles when page is unloaded
        window.addEventListener('beforeunload', handleBeforeUnload);

        // cleanup function handles when component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            setModalAction('confirm-cancel-product-updates');
            setOpenModal(true);
        };
    }, []);

    useEffect(() => {
        const getProductDetail = async () => {
            const detail = await fetchProductDetail(barcode);
            setProductDetail(detail);
        };

        getProductDetail();

        return () => {
            dispatch(actions.setConfirmClearImage(false));
        };
    }, [barcode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newProductDetail = Object.keys(productDetail).reduce((acc, key) => {
            if (e.target[key]) {
                return {
                    ...acc,
                    [key]: e.target[key].value,
                };
            } else {
                return { ...acc };
            }
        }, {});

        const data = { ...productDetail, ...newProductDetail };
        const saved = await productService.saveProduct(data);

        setIsLoading(false);
        setProductChanged(false);
        setProductDetail(saved);
    };

    return !productDetail ? (
        <div className="flex items-center justify-center p-6 h-screen-content">
            <div className="text-center">
                <h1 className="text-2xl font-semibold capitalize">404 Product not found</h1>
                <p className="text-gray-600 text-lg my-4">
                    We are sorry for this inconvenience. This product has been disabled.
                </p>
            </div>
        </div>
    ) : (
        <ProductDetailContext.Provider value={{ productDetail, setProductDetail }}>
            <form onSubmit={handleSubmit} className="relative h-screen-content overflow-auto">
                <Transition
                    as={Fragment}
                    show={authorizeAdmin(user) && productChanged}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <header className="z-10 sticky bg-white top-0 inset-x-0 px-4 flex items-center justify-center shadow-md p-4">
                        <div className="container flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-400">Updates have not been saved</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setModalAction('confirm-cancel-product-updates');
                                        setOpenModal(true);
                                    }}
                                    type="button"
                                    className="border rounded-sm py-2 px-4 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 min-w-[4rem] flex items-center justify-center hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                                >
                                    {isLoading ? <Spinner /> : 'Update'}
                                </button>
                            </div>
                        </div>
                    </header>
                </Transition>

                <section className="flex justify-center pt-6">
                    <section className="container space-y-4 px-4">
                        {/* Main header */}
                        <section className="mb-12 flex items-center justify-between">
                            <div className="flex items-center text-sm gap-2 text-gray-500">
                                <Link className="hover:text-blue-500 hover:underline" to="#">
                                    Sample
                                </Link>{' '}
                                <ChevronRightIcon className="w-3 h-3" />
                                <Link className="hover:text-blue-500 hover:underline" to="#">
                                    breadcums
                                </Link>
                            </div>
                        </section>
                        <section>
                            <h2 className="font-semibold text-xl">{productDetail?.name}</h2>
                        </section>
                        <section className="container grid grid-cols-4 gap-6">
                            <section className="space-y-4 col-span-3">
                                <GeneralProductInfo
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                    setProductChanged={setProductChanged}
                                />
                                <ProductPrice productDetail={productDetail} setProductDetail={setProductDetail} />
                                <InventoryManagement
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                />
                                <ProductThumbnail
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                    setOpenModal={setOpenModal}
                                    setModalAction={setModalAction}
                                />
                                <CalculationUnit productDetail={productDetail} setProductDetail={setProductDetail} />
                                <ProductDetailProperties
                                    productDetail={productDetail}
                                    setProductChanged={setProductChanged}
                                    setProductDetail={setProductDetail}
                                />

                                <div className="py-4">
                                    <button
                                        onClick={() => {
                                            setModalAction('delete-product');
                                            setOpenModal(true);
                                        }}
                                        className="rounded-sm hover:bg-red-50 transition px-4 py-2 ring-1 ring-red-500 text-red-500 flex items-center gap-2"
                                        type="button"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
                <Modal productDetail={productDetail} open={openModal} setOpen={setOpenModal} action={modalAction} />
            </form>
        </ProductDetailContext.Provider>
    );
};

export default ProductDetail;
