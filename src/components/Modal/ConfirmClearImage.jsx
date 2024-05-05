import React, { memo, useEffect, useState } from 'react';
import { Spinner } from '~/icons';
import { actions, useStore } from '~/store';

const ConfirmClearImage = ({ setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [, dispatch] = useStore();

    const handleClearImage = () => {
        setIsLoading(true);
        dispatch(actions.setConfirmClearImage(true));
        setOpen(false);
        setIsLoading(false);
    };

    useEffect(() => {
        return () => {
            dispatch(actions.deleteClearedImage());
        };
    }, [dispatch]);

    return (
        <div className="w-full space-y-4 px-4">
            <div className="space-y-2">
                <h2>Image Delete Confirmation</h2>
                <p className="text-sm text-gray-600">
                    Are you sure to permanently delete this image? This action won't be undo
                </p>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={handleClearImage}
                    className="bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    {isLoading ? <Spinner /> : 'Continue'}
                </button>
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default memo(ConfirmClearImage);
