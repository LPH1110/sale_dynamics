import React from 'react';
import { Link } from 'react-router-dom';
import { commasNumber } from '~/utils';

const ProductCard = ({ data }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img className="w-12 h-12 rounded-sm" src={data?.thumbnails[0].url} alt="" />
                <Link
                    to={`/products/detail/${data?.barcode}`}
                    className="font-semibold text-blue-500 hover:text-blue-600 transition"
                >
                    {data?.name}
                </Link>
            </div>
            {/* <h4 className="font-semibold text-slate-500">$ {commasNumber(data?.totalRevenue)}</h4> */}
        </div>
    );
};

export default ProductCard;
