import { PhotoIcon } from '@heroicons/react/24/outline';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { Tooltip } from '~/components';
import { QuestionMarkCircleIcon } from '~/icons';
import { actions, useStore } from '~/store';

const GalleryThumb = ({ clearImage, imageURL }) => {
    return (
        <div className="bg-white relative text-center border rounded-sm">
            <div className="relative w-full  pb-[100%]">
                <img className="m-auto block max-w-full max-h-full absolute inset-0" src={imageURL} alt={imageURL} />
                {/* Overlay */}
                <div className="text-white flex items-center justify-center gap-2 w-full h-full bg-gray-700 absolute z-3 opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition cursor-all-scroll">
                    <Tooltip placement="top" message="Watch closer">
                        <button type="button" className="hover:text-gray-300 transition">
                            <EyeIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip placement="top" message="Clear this image">
                        <button
                            onClick={() => clearImage(imageURL)}
                            type="button"
                            className="hover:text-gray-300 transition"
                        >
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

const Gallery = ({ clearImage, images = [] }) => {
    const filterdImages = images.filter((url) => url !== images[0]);
    return (
        <section className="grid grid-cols-3 gap-3">
            {/* Main sector */}
            <section>
                <GalleryThumb clearImage={clearImage} imageURL={images[0]} />
            </section>
            {/* Others */}
            <section className="text-center col-span-2">
                <div className="grid grid-cols-4 gap-3">
                    {filterdImages.map((url) => {
                        return (
                            <Fragment key={url}>
                                <GalleryThumb clearImage={clearImage} imageURL={url} />
                            </Fragment>
                        );
                    })}
                    <label htmlFor="images" className="block min-h-[8.5rem]">
                        <div className="h-full text-blue-500 gap-2 flex flex-col items-center justify-center p-6 border border-dashed hover:bg-blue-50 transition cursor-pointer rounded-md text-center text-sm">
                            <h4>Add images</h4>
                        </div>
                    </label>
                </div>
            </section>
        </section>
    );
};

const CreateProductThumbnail = ({ initial, setOpenModal, setModalAction, handleChangeProductInfo }) => {
    const [, dispatch] = useStore();

    const uploadImages = (e) => {
        const urls = Object.entries(e.target.files).map(([index, file]) => URL.createObjectURL(file));
        handleChangeProductInfo('thumbnails', urls);
    };

    const clearImage = (imagePath) => {
        setOpenModal(true);
        setModalAction('confirm-clear-image');
        dispatch(actions.setClearedImage(imagePath));
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
                {initial.length > 0 ? (
                    <Gallery clearImage={clearImage} images={initial} />
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

export default CreateProductThumbnail;
