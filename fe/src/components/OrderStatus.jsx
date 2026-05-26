import React from 'react';

const OrderStatus = ({ status }) => {
    const statuses = {
        Paid: (
            <p className="text-sm inline-block px-2 py-1 rounded-md bg-emerald-50 border border-emerald-500 text-emerald-500">
                Paid successully
            </p>
        ),
        'Partial paid': (
            <p className="text-sm inline-block px-2 py-1 rounded-md border bg-slate-50 border-slate-500 text-slate-500">
                Partial paid
            </p>
        ),
    };

    return statuses[status];
};

export default OrderStatus;
