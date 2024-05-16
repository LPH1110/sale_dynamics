import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '..';
import { PercentBadge } from '../badges';
import { commasNumber, request } from '~/utils';
import { DashboardContext } from '~/contexts/pool';
import { format } from 'date-fns';
import { Spinner } from '~/icons';

const NumOrders = () => {
    const [orderQty, setOrderQty] = useState(12312);
    const [isLoading, setIsLoading] = useState(false);
    const [margin, setMargin] = useState(-24);
    const { currentTime, compareTime } = useContext(DashboardContext);

    useEffect(() => {
        const getRevenue = async () => {
            setIsLoading(true);
            const res = await request.post('orders/quantity', {
                from: format(currentTime.from, 'yyyy-MM-dd'),
                to: format(currentTime.to, 'yyyy-MM-dd'),
            });
            setOrderQty(res);
            setIsLoading(false);
        };

        getRevenue();
    }, [currentTime]);

    return (
        <div className="shadow-sm rounded-md bg-white flex">
            <div className="w-2 h-full bg-blue-500 rounded-l-md"></div>
            <div className="space-y-4 p-4 w-full">
                <h4 className="font-semibold inline-block text-slate-500">Number of Orders</h4>
                <div className="flex items-end justify-between">
                    {isLoading ? <Spinner /> : <h1 className="text-2xl font-semibold">{commasNumber(orderQty)}</h1>}
                    {compareTime && <PercentBadge margin={margin} />}
                </div>
            </div>
        </div>
    );
};

export default NumOrders;
