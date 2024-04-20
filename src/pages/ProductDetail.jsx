import { Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    GeneralProductInfo,
    Modal,
    ProductDetailProperties,
    ProductDetailVariants,
    ProductThumbnail,
} from '~/components';
import { actions, useStore } from '~/store';
import { sampleProductDetail } from '~/store/constants';

const ProductDetail = () => {
    const { productId } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [state, dispatch] = useStore();
    const { productChanges, productDetail } = state;
    const productNameRef = useRef();

    const fetchProductDetail = () => {
        try {
            // const res = await axios.get(
            //     `${process.env.REACT_APP_SERVER_BASE}/products/get_by_id.php?productId=${productId}`,
            // );
            dispatch(actions.setProductDetail(sampleProductDetail));
            console.log('fetch product detail');
            if (productNameRef.current) {
                productNameRef.current.value = sampleProductDetail.name;
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProductDetail();

        return () => {
            if (Object.keys(productChanges).length > 0) {
                setModalAction('confirm-cancel-product-updates');
                setOpenModal(true);
                dispatch(actions.deleteProductChanges());
            }
            dispatch(actions.setProductDetail(sampleProductDetail));
        };
    }, [productId]);

    return (
        <section className="relative h-screen-content overflow-auto">
            <Transition
                as={Fragment}
                show={Object.keys(productChanges).length > 0}
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
                                type="button"
                                onClick={() => {
                                    console.log(productChanges);
                                    dispatch(actions.setProductDetail(productChanges));
                                    dispatch(actions.deleteProductChanges());
                                }}
                                className="bg-blue-500 min-w-[4rem] hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                            >
                                Update
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
                    <h2 className="font-semibold text-xl">{productDetail.name}</h2>
                </section>
                <section className="container grid grid-cols-4 gap-6">
                    <section className="space-y-4 col-span-3">
                        <GeneralProductInfo ref={productNameRef} productDetail={productDetail} />
                        <ProductThumbnail
                            productDetail={productDetail}
                            setOpenModal={setOpenModal}
                            setModalAction={setModalAction}
                        />
                        <ProductDetailProperties productDetail={productDetail} />
                        <ProductDetailVariants
                            setModalAction={setModalAction}
                            setOpenModal={setOpenModal}
                            productId={productId}
                        />
                    </section>
                </section>
            </section>
            <Modal
                fetchProductDetail={fetchProductDetail}
                open={openModal}
                setOpen={setOpenModal}
                action={modalAction}
            />
        </section>
    );
};

export default ProductDetail;
