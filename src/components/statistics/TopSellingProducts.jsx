import React, { Fragment, useContext, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { DashboardContext } from '~/contexts/pool';
import { request } from '~/utils';
import { format } from 'date-fns';
import { Spinner } from '~/icons';

const topSolds = [
    {
        barcode: 'H0001',
        name: 'iMac 21.5 inch 2017 MMQA2',
        thumbnail:
            'https://product.hstatic.net/200000877271/product/mug-today-is-a-good-day_f3d1123c921349aeb926e94558d1c76c_30887f00e4ec414b937e036d18c32353.jpg',
        totalRevenue: 123124124,
    },
    {
        barcode: 'H0002',
        name: 'iMac 21.5 inch 2017 MMQA2',
        thumbnail:
            'https://product.hstatic.net/200000877271/product/mug-today-is-a-good-day_f3d1123c921349aeb926e94558d1c76c_30887f00e4ec414b937e036d18c32353.jpg',
        totalRevenue: 151246,
    },
    {
        barcode: 'H0003',
        name: 'iMac 21.5 inch 2017 MMQA2',
        thumbnail:
            'https://product.hstatic.net/200000877271/product/mug-today-is-a-good-day_f3d1123c921349aeb926e94558d1c76c_30887f00e4ec414b937e036d18c32353.jpg',
        totalRevenue: 1236372,
    },
];

const TopSellingProducts = () => {
    const [topSolds, setTopSolds] = useState([]);
    const { currentTime, compareTime } = useContext(DashboardContext);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getTopSolds = async () => {
            setIsLoading(true);
            let limit = 5;
            const res = await request.post(`orders/top-sellings?limit=${limit}`, {
                from: format(currentTime.from, 'yyyy-MM-dd'),
                to: format(currentTime.to, 'yyyy-MM-dd'),
            });
            setTopSolds(res);
            setIsLoading(false);
        };
        getTopSolds();
    }, [currentTime]);

    return (
        <div className="shadow-sm rounded-md bg-white">
            <div className="space-y-6 p-4 w-full">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold inline-block text-slate-500">Top Selling Product</h4>
                    <Link className="text-blue-500 hover:text-blue-600 transition" to="/products/report">
                        Report
                    </Link>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    topSolds.map((product) => (
                        <Fragment key={product.barcode}>
                            <ProductCard data={product} />
                        </Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopSellingProducts;
