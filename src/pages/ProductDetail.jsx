import { Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    GeneralProductInfo,
    Modal,
    ProductDetailProperties,
    ProductDetailVariants,
    ProductThumbnail,
} from '~/components';
import { Spinner } from '~/icons';
import { productService } from '~/services';
import fetchProductDetail from '~/services/products/fetchProductDetail';
import { actions, useStore } from '~/store';

const ProductDetail = () => {
    const { barcode } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [productDetail, setProductDetail] = useState(null);
    const [productChanged, setProductChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, dispatch] = useStore();

    const productNameRef = useRef();
    const formRef = useRef();

    const handleUpdate = () => {};

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

    return (
        <form onSubmit={handleSubmit} className="relative h-screen-content overflow-auto">
            <Transition
                as={Fragment}
                show={productChanged}
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
                                onClick={handleUpdate}
                                className="bg-blue-500 min-w-[4rem] flex items-center justify-center hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                            >
                                {isLoading ? <Spinner /> : 'Update'}
                            </button>
                        </div>
                    </div>
                </header>
            </Transition>

            <section className="px-4 pt-6 space-y-4">
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
                            ref={productNameRef}
                            productDetail={productDetail}
                            setProductChanged={setProductChanged}
                        />
                        <ProductThumbnail
                            productDetail={productDetail}
                            setProductDetail={setProductDetail}
                            setOpenModal={setOpenModal}
                            setModalAction={setModalAction}
                        />
                        <ProductDetailProperties
                            productDetail={productDetail}
                            setProductChanged={setProductChanged}
                            setProductDetail={setProductDetail}
                        />
                        <ProductDetailVariants
                            setModalAction={setModalAction}
                            setOpenModal={setOpenModal}
                            productId={barcode}
                        />
                    </section>
                </section>
            </section>
            <Modal productDetail={productDetail} open={openModal} setOpen={setOpenModal} action={modalAction} />
        </form>
    );
};

export default ProductDetail;
