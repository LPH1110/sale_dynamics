import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GalleryCard, Tooltip } from '~/components';
import { QuestionMarkCircleIcon } from '~/icons';
import { actions, useStore } from '~/store';

const ProductThumbnail = ({ productDetail, setOpenModal, setModalAction }) => {
    const [, dispatch] = useStore();
    const [thumbnails, setThumbnails] = useState([]);

    const uploadImages = (e) => {
        const urls = Object.entries(e.target.files).map(([index, file]) => URL.createObjectURL(file));
        dispatch(actions.addProductChanges({ propName: 'thumbnails', value: [...productDetail.thumbnails, ...urls] }));
        dispatch(actions.setProductDetail({ thumbnails: [...productDetail.thumbnails, ...urls] }));
    };

    const clearImage = (imagePath) => {
        setOpenModal(true);
        setModalAction('confirm-clear-image');
        dispatch(actions.setClearedImage(imagePath));
    };

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                const res = axios.get(
                    `${process.env.REACT_APP_SERVER_BASE}/thumbnails?parent_id=${productDetail.product_id}`,
                );
                if (res.data) {
                    setThumbnails(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        // fetchThumbnails()
    }, []);

    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Product thumbnail
                </label>
                <Tooltip
                    placement="top"
                    message="Only apply for png, jpg, jpeg, gif rate 1:1 (square images) and screen resolution 2048px x 2048px for the best image quality"
                >
                    <button type="button" className="w-4 h-4 text-blue-500">
                        <QuestionMarkCircleIcon />
                    </button>
                </Tooltip>
            </div>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div>
                {productDetail.thumbnails.length > 0 ? (
                    <GalleryCard clearImage={clearImage} images={productDetail.thumbnails} />
                ) : (
                    <label htmlFor="images">
                        <div className="text-blue-500 gap-2 flex flex-col items-center justify-center p-6 border border-dashed hover:bg-blue-50 transition cursor-pointer rounded-md text-center text-sm">
                            <PhotoIcon className="w-10 h-10 text-gray-400" />
                            <h4>Add images</h4>
                            <p>
                                Add from URL <span className="text-gray-600">(images/videos)</span>
                            </p>
                        </div>
                    </label>
                )}
                <input multiple onChange={uploadImages} type="file" name="images" id="images" className="hidden" />
            </div>
        </section>
    );
};

export default ProductThumbnail;
