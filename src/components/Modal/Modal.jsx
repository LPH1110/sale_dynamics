import { Fragment, memo, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CreateAccountModal from './CreateAccountModal';
import ConfirmDeletionModal from './ConfirmDeletionModal';
import ConfirmClearImage from './ConfirmClearImage';
import ConfirmCancelProductUpdates from './ConfirmCancelProductUpdates';
import UpdateVariantThumb from './UpdateVariantThumb';
import ResendVerification from './ResendVerification';
import ProductSearch from './ProductSearch';
import CreateCustomerModal from './CreateCustomerModal';
import CreateOrderModal from './CreateOrderModal';
import OrderPaymentModal from './OrderPaymentModal';

function Modal({ setCreateVariantForm, fetchProductDetail, tableName, open, setOpen, action, setAccounts }) {
    const [dialogs] = useState({
        'create-account': <CreateAccountModal setAccounts={setAccounts} setOpen={setOpen} />,
        'confirm-delete': <ConfirmDeletionModal tableName={tableName} setOpen={setOpen} />,
        'confirm-clear-image': <ConfirmClearImage setOpen={setOpen} />,
        'confirm-cancel-product-updates': (
            <ConfirmCancelProductUpdates fetchProductDetail={fetchProductDetail} setOpen={setOpen} />
        ),
        'update-variant-thumb': <UpdateVariantThumb setOpen={setOpen} setCreateVariantForm={setCreateVariantForm} />,
        'confirm-cancel-create-variant': <div>Cancel create variant</div>,
        'resend-verification': <ResendVerification setOpen={setOpen} />,
        'product-search': <ProductSearch setOpen={setOpen} />,
        'create-customer': <CreateCustomerModal setOpen={setOpen} />,
        'create-order': <CreateOrderModal setOpen={setOpen} />,
        'order-payment': <OrderPaymentModal setOpen={setOpen} />,
    });

    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white py-4 pb-4 pt-5 sm:pb-4 w-full">
                                    <div className="sm:flex sm:items-start">{dialogs[action]}</div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default memo(Modal);
