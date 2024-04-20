import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CreateAccountModal from './CreateAccountModal';
import ConfirmDeletionModal from './ConfirmDeletionModal';
import ConfirmClearImage from './ConfirmClearImage';
import ConfirmCancelProductUpdates from './ConfirmCancelProductUpdates';
import UpdateVariantThumb from './UpdateVariantThumb';

export default function Modal({
    setCreateVariantForm,
    fetchProductDetail,
    setCreateProductInfo,
    tableName,
    open,
    setOpen,
    action,
}) {
    const [dialogs] = useState({
        'create-account': <CreateAccountModal setOpen={setOpen} />,
        'confirm-delete': <ConfirmDeletionModal tableName={tableName} setOpen={setOpen} />,
        'confirm-clear-image': <ConfirmClearImage setCreateProductInfo={setCreateProductInfo} setOpen={setOpen} />,
        'confirm-cancel-product-updates': (
            <ConfirmCancelProductUpdates fetchProductDetail={fetchProductDetail} setOpen={setOpen} />
        ),
        'update-variant-thumb': <UpdateVariantThumb setOpen={setOpen} setCreateVariantForm={setCreateVariantForm} />,
        'confirm-cancel-create-variant': <div>Cancel create variant</div>,
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
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
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
