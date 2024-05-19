import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { Link } from 'react-router-dom';

const CustomerCard = ({ customer, setCustomer }) => {
    return (
        <div className="bg-white rounded-sm shadow-md border text-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h4 className="font-semibold">Customer Information</h4>
                {setCustomer && (
                    <button onClick={() => setCustomer(null)} type="button">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="p-4 space-y-1">
                <Link
                    className="font-semibold text-blue-500 hover:text-blue-600 transition"
                    to={`/customers/detail/${customer?.phone}`}
                >
                    {customer?.firstname + ' ' + customer?.lastname}
                </Link>
                <p className="text-slate-500">{customer?.phone}</p>
                <p className="text-slate-500">{customer?.email}</p>
            </div>
            <div className="p-4 border-y space-y-4">
                <div className="space-y-2">
                    <h4 className="font-semibold">Shipment</h4>
                    <p className="text-slate-500 italic">No company info</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-slate-500">{customer?.address}</p>
                </div>
            </div>
            <div className="px-4 space-y-2 py-4">
                <h4 className="font-semibold">Note</h4>
                <p className="italic text-slate-500">No notes about customer</p>
            </div>
        </div>
    );
};

export default CustomerCard;
