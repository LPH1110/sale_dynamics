import React, { useContext } from 'react';
import { CreateOrderContext } from '~/contexts/pool';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OrderConfirmCard = () => {
    const { confirmChecked, setConfirmChecked } = useContext(CreateOrderContext);
    return (
        <div className="bg-white rounded-sm shadow-md border space-y-4 text-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h4 className="font-semibold">Confirm Order</h4>
            </div>
            <div className="px-4 pb-4 space-y-2">
                {confirmChecked ? (
                    <p className="flex items-center gap-2">
                        <span className="text-blue-500">
                            <CheckCircleIcon className="w-5 h-5" />
                        </span>{' '}
                        Order has been confirmed
                    </p>
                ) : (
                    <>
                        <p>Please confirm this order</p>
                        <button
                            type="button"
                            onClick={() => setConfirmChecked(true)}
                            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-sm"
                        >
                            Confirm order
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmCard;
