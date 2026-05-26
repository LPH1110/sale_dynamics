import { PhotoIcon } from '@heroicons/react/24/outline';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCreateVariantContext } from '~/contexts/CreateVariantContext/CreateVariantContextProvider';
import { Tooltip } from '~/components';

const VariantInfoCard = ({ thumbnail, productId, setOpenModal, setModalAction, handleChange }) => {
    const { setAvailableThumbnails } = useCreateVariantContext();
    const [variantName, setVariantName] = useState('');

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/thumbnails/get_by_product_id.php?product_id=${productId}`,
                );
                if (res.data) {
                    setAvailableThumbnails(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        // fetchThumbnails();
    }, []);

    const clearImage = (e, imagePath) => {
        e.stopPropagation();
        handleChange('thumbnail', '');
    };

    return (
        <div className="bg-white p-4 rounded-sm shadow-md">
            <label className="font-semibold block text-sm" htmlFor="thumbnails">
                Variant info
            </label>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="space-y-2">
                <label htmlFor="productName" className="font-semibold block text-sm text-gray-600">
                    Title
                </label>
                <div className="flex items-start gap-4">
                    <div className="space-y-2 flex-1">
                        <input
                            className="border p-2 rounded-sm w-full ring-2 ring-transparent focus:ring-blue-400 transition"
                            type="text"
                            name="variantName"
                            id="variantName"
                            value={variantName}
                            onChange={(e) => setVariantName(e.target.value)}
                            onBlur={(e) => {
                                handleChange('name', e.target.value);
                            }}
                            autoComplete="off"
                        />
                    </div>

                    {thumbnail ? (
                        <div
                            onClick={(e) => {
                                setModalAction('update-variant-thumb');
                                setOpenModal(true);
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="bg-white w-32 h-32 text-center border rounded-sm inline-block">
                                <div className="relative h-full w-full pb-[100%]">
                                    <img
                                        className="m-auto block max-w-full max-h-full absolute inset-0"
                                        src={thumbnail}
                                        alt="thumbnail"
                                    />
                                    {/* Overlay */}
                                    <div className="text-white flex items-center justify-center gap-2 w-full h-full bg-gray-700 absolute z-3 opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition cursor-all-scroll">
                                        <Tooltip placement="top" message="Watch closer">
                                            <button type="button" className="hover:text-gray-300 transition">
                                                <EyeIcon className="w-6 h-6" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip placement="top" message="Clear this image">
                                            <button
                                                onClick={(e) => clearImage(e, thumbnail)}
                                                type="button"
                                                className="hover:text-red-500 transition"
                                            >
                                                <TrashIcon className="w-6 h-6" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="text-blue-500 text-sm font-semibold hover:underline">
                                Change picture
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setModalAction('update-variant-thumb');
                                setOpenModal(true);
                            }}
                            className="transition text-blue-500 flex flex-col text-sm items-center justify-center cursor-pointer w-32 h-32 rounded-md border border-dashed hover:bg-blue-50 bg:border-blue-500"
                        >
                            <PhotoIcon className="w-10 h-10 text-gray-400" />
                            <h4>Add images</h4>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VariantInfoCard;
