import { LockClosedIcon } from '@heroicons/react/24/outline';
import React from 'react';

const AccountBlockedNotification = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center p-4 gap-4">
            <div className="p-3 rounded-full ring-1 ring-red-500 bg-red-50">
                <LockClosedIcon className="w-10 h-10 text-red-500" />
            </div>
            <h4 className="text-xl font-semibold">We're sorry, your account is being blocked</h4>
            <p className="text-slate-500">
                You have no access to the system. Please contact your manager for more detail
            </p>
        </div>
    );
};

export default AccountBlockedNotification;
