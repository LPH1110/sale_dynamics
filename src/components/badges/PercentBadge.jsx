import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import React from 'react';

const PercentBadge = ({ margin }) => {
    return margin > 0 ? (
        <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            +{margin}% <ArrowUpIcon className="w-3 h-3" />
        </span>
    ) : (
        <span className="flex items-center gap-1 text-red-500 font-semibold">
            {margin}% <ArrowDownIcon className="w-3 h-3" />
        </span>
    );
};

export default PercentBadge;
