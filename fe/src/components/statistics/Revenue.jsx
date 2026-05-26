import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '..';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { PercentBadge } from '../badges';
import { commasNumber, request } from '~/utils';
import { DashboardContext } from '~/contexts/pool';
import { format } from 'date-fns';
import { Spinner } from '~/icons';

const Revenue = () => {
    const [revenue, setRevenue] = useState(1231123);
    const [isLoading, setIsLoading] = useState(false);
    const [margin, setMargin] = useState(-24);
    const { currentTime, compareTime } = useContext(DashboardContext);

    useEffect(() => {
        const getRevenue = async () => {
            setIsLoading(true);
            const res = await request.post('user/revenue', {
                from: format(currentTime.from, 'yyyy-MM-dd'),
                to: format(currentTime.to, 'yyyy-MM-dd'),
            });
            setRevenue(res);
            setIsLoading(false);
        };

        getRevenue();
    }, [currentTime]);

    return (
        <div className="shadow-sm rounded-md bg-white flex">
            <div className="w-2 h-full bg-blue-500 rounded-l-md"></div>
            <div className="space-y-4 p-4 w-full">
                <Tooltip message="Revenue is calculated by total of product's price x quantity">
                    <h4 className="font-semibold inline-block text-slate-500">Revenue</h4>
                </Tooltip>
                <div className="flex items-end justify-between">
                    {isLoading ? <Spinner /> : <h1 className="text-2xl font-semibold">$ {commasNumber(revenue)}</h1>}
                    {compareTime && <PercentBadge margin={margin} />}
                </div>
            </div>
        </div>
    );
};

export default Revenue;
