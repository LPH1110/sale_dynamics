import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '~/components';

const GalleryThumb = ({ clearImage, imageId, imageURL }) => {
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
                            onClick={() => clearImage(imageId)}
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

export default GalleryThumb;
