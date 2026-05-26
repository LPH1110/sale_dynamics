import { Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, ProductPrice, VariantInfoCard, VariantListCard, VariantProductCard } from '~/components';
import CreateVariantContextProvider from '~/contexts/CreateVariantContext/CreateVariantContextProvider';

const CreateVariant = () => {
    const { productId } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [form, setForm] = useState({
        salePrice: 0,
        comparedPrice: 0,
        thumbnail: '',
    });
    const navigate = useNavigate();

    const handleCreate = () => {
        console.log(JSON.stringify(form));
    };

    const handleCancel = () => {
        navigate(`/products/detail/${productId}`);
    };

    const handleChange = (propName, value) => {
        switch (typeof value) {
            case 'string':
                if (form[propName]?.localeCompare(value) !== 0) {
                    setForm((prev) => ({
                        ...prev,
                        [propName]: value,
                    }));
                }
                break;
            case 'number':
                if (form[propName] !== value) {
                    setForm((prev) => ({
                        ...prev,
                        [propName]: value,
                    }));
                }
                break;
            default:
                break;
        }
        setShowHeader(true);
    };

    return (
        <CreateVariantContextProvider>
            <section className="relative h-screen-content overflow-auto">
                <Transition
                    as={Fragment}
                    show={showHeader}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <header className="z-10 sticky bg-white top-0 inset-x-0 px-4 flex items-center justify-center shadow-md p-4">
                        <div className="container flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-400">New creating has not been saved</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="border rounded-sm py-2 px-4 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    className="bg-blue-500 min-w-[4rem] hover:bg-blue-600 rounded-sm transition text-white font-semibold py-2 px-4"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </header>
                </Transition>

                <section className="flex">
                    <section className="m-auto container px-4 pt-6 space-y-4">
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
                        <section className="container grid grid-cols-4 gap-6">
                            <section className="space-y-6">
                                <VariantProductCard productId={productId} />
                                <VariantListCard productId={productId} />
                            </section>
                            <section className="col-span-3 space-y-6">
                                <VariantInfoCard
                                    thumbnail={form.thumbnail}
                                    productId={productId}
                                    setOpenModal={setOpenModal}
                                    setModalAction={setModalAction}
                                    handleChange={handleChange}
                                />
                                <ProductPrice
                                    title="Variant detail"
                                    initial={{ salePrice: form.salePrice, comparedPrice: form.comparedPrice }}
                                    handleChange={handleChange}
                                />
                            </section>
                        </section>
                    </section>
                </section>
                <Modal open={openModal} setOpen={setOpenModal} action={modalAction} setCreateVariantForm={setForm} />
            </section>
        </CreateVariantContextProvider>
    );
};

export default CreateVariant;
