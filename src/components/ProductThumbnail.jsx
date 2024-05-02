import { PhotoIcon } from '@heroicons/react/24/outline';
import { memo, useEffect, useState } from 'react';
import { GalleryCard, Tooltip } from '~/components';
import { QuestionMarkCircleIcon } from '~/icons';
import { productService } from '~/services';
import { fetchProductDetail } from '~/services/products';
import saveProductThumbnail from '~/services/products/saveProductThumbnail';
import { actions, useStore } from '~/store';
import { setClearedImage } from '~/store/actions';

const ProductThumbnail = ({ productDetail, setProductDetail, setOpenModal, setModalAction }) => {
    const [state, dispatch] = useStore();
    const [thumbnails, setThumbnails] = useState([]);
    const [clearedId, setClearedId] = useState();

    const uploadImages = async (e) => {
        let files = Array.from(e.target.files);
        for (let i = 0; i < files.length; i++) {
            let thumbnail = await saveProductThumbnail(productDetail.barcode, files[i]);
            setThumbnails((prev) => [...prev, thumbnail]);
        }
    };

    useEffect(() => {
        if (productDetail !== null) {
            setThumbnails(productDetail.thumbnails);
        }
    }, [productDetail]);

    useEffect(() => {
        const clearImage = async () => {
            console.log(productDetail.barcode);
            console.log(clearedId);
            await productService.deleteProductThumbnail({
                barcode: productDetail.barcode,
                thumbnailId: clearedId,
            });
        };
        if (state.confirmedClearImage) {
            clearImage();
            dispatch(actions.setConfirmClearImage(false));
            setThumbnails((prev) => {
                let next = prev.filter((thumbnail) => thumbnail.id !== clearedId);
                return next;
            });
        }
    }, [clearedId, state.confirmedClearImage, dispatch, productDetail]);

    const handleClearImage = (imageId) => {
        setClearedId(imageId);
        setModalAction('confirm-clear-image');
        setOpenModal(true);
    };

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
                {thumbnails.length > 0 ? (
                    <GalleryCard clearImage={handleClearImage} images={thumbnails} />
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

export default memo(ProductThumbnail);
