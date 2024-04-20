import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '~/icons';
import { actions, useStore } from '~/store';

const ConfirmCancelProductUpdates = ({ fetchProductDetail, setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, dispatch] = useStore();
    const { cancelPrdChangesOpt } = state;
    const navigate = useNavigate();

    const cancelChanges = () => {
        try {
            setIsLoading(true);
            dispatch(actions.deleteProductChanges());
        } catch (error) {
            console.error(error);
        } finally {
            if (cancelPrdChangesOpt) {
                navigate(cancelPrdChangesOpt);
                dispatch(actions.clearCancelProductChangesOption());
            } else {
                fetchProductDetail();
            }
            setIsLoading(false);
            setOpen(false);
        }
    };

    const continueUpdate = () => {
        setOpen(false);
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-2">
                <h2>Cancel all changes that haven't been saved</h2>
                <p className="text-sm text-gray-600">
                    If you cancel this changes, then all made changes from the last time will be removed.
                </p>
            </div>
            <div className="flex justify-end items-center gap-2 text-sm">
                <button
                    type="button"
                    onClick={cancelChanges}
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
