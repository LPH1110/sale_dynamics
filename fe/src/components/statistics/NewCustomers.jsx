import React, { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '~/contexts/pool';
import { Spinner } from '~/icons';
import { PercentBadge } from '../badges';
import { commasNumber, request } from '~/utils';
import { format } from 'date-fns';

const NewCustomers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [qty, setQty] = useState(0);
    const [margin, setMargin] = useState(-24);
    const { currentTime, compareTime } = useContext(DashboardContext);

    useEffect(() => {
        const getNewCustomerQty = async () => {
            setIsLoading(true);
            const res = await request.post('customers/count/news', {
                from: format(currentTime.from, 'yyyy-MM-dd'),
                to: format(currentTime.to, 'yyyy-MM-dd'),
            });
            setQty(res);
            setIsLoading(false);
        };

        getNewCustomerQty();
    }, []);

    return (
        <div className="shadow-sm rounded-md bg-white flex">
            <div className="w-2 h-full bg-blue-500 rounded-l-md"></div>
            <div className="space-y-4 p-4 w-full">
                <h4 className="font-semibold inline-block text-slate-500">New Customers</h4>
                <div className="flex items-end justify-between">
                    {isLoading ? <Spinner /> : <h1 className="text-2xl font-semibold">{qty}</h1>}
                    {compareTime && <PercentBadge margin={margin} />}
                </div>
            </div>
        </div>
    );
};

export default NewCustomers;
