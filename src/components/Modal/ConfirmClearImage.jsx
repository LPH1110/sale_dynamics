import React, { useEffect, useState } from 'react';
import { Spinner } from '~/icons';
import { actions, useStore } from '~/store';

const ConfirmClearImage = ({ setCreateProductInfo, setOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, dispatch] = useStore();
    const { productDetail, clearedImage } = state;

    const handleClearImage = () => {
        let newThumbnails;
        setIsLoading(true);
        if (setCreateProductInfo) {
            setCreateProductInfo((prev) => {
                newThumbnails = prev.thumbnails.filter((thumb) => thumb !== clearedImage);
                return {
                    ...prev,
                    thumbnails: [...newThumbnails],
                };
            });
        } else {
            // Product detail
            newThumbnails = productDetail.thumbnails.filter((thumb) => thumb !== clearedImage);
            dispatch(actions.addProductChanges({ propName: 'thumbnails', value: newThumbnails }));
            dispatch(actions.setProductDetail({ thumbnails: newThumbnails }));
        }
        setIsLoading(false);
        setOpen(false);
    };

    useEffect(() => {
        return () => {
            dispatch(actions.deleteClearedImage());
        };
    }, [dispatch]);

    return (
        <div className="w-full space-y-4">
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

export default ConfirmClearImage;
