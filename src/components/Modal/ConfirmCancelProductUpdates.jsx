import { useState } from 'react';
import { Spinner } from '~/icons';

const ConfirmCancelProductUpdates = ({ setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);

    const continueUpdate = () => {
        setOpen(false);
    };

    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2>Cancel all changes that haven't been saved</h2>
                <p className="text-sm text-gray-600">
                    If you cancel this changes, then all made changes from the last time will be removed.
                </p>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    className="bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    {isLoading ? <Spinner /> : 'Cancel changes'}
                </button>
                <button
                    onClick={continueUpdate}
                    type="button"
                    className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition"
                >
                    Continue update
                </button>
            </div>
        </div>
    );
};

export default ConfirmCancelProductUpdates;
