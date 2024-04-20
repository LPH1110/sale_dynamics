import { Fragment, useEffect } from 'react';
import { useCreateVariantContext } from '~/contexts/CreateVariantContext/CreateVariantContextProvider';
import { XMarkIcon } from '@heroicons/react/24/outline';

const UpdateVariantThumb = ({ setCreateVariantForm, setOpen }) => {
    const { selectedThumb, setSelectedThumb, availableThumbs, setAvailableThumbs } = useCreateVariantContext();
    const filterdImages = availableThumbs.filter((url) => url !== availableThumbs[0]);

    const handleConfirm = () => {
        setCreateVariantForm((prev) => ({
            ...prev,
            thumbnail: selectedThumb,
        }));
        setOpen(false);
    };

    const uploadImages = (e) => {
        const urls = Object.entries(e.target.files).map(([index, file]) => URL.createObjectURL(file));
        setAvailableThumbs((prev) => [...prev, ...urls]);
    };

    useEffect(() => {
        return () => setSelectedThumb('');
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Update Variant Thumb</h2>
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="text-gray-300 hover:text-gray-500 transition"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <section className="border-y py-6 my-6">
                <section className="grid grid-cols-3 gap-3 border border-dashed rounded-md hover:border-blue-400 transition p-4">
                    {/* Main sector */}
                    <div
                        onClick={() => setSelectedThumb(availableThumbs[0])}
                        className={
                            selectedThumb === availableThumbs[0]
                                ? 'bg-white text-center border-2 border-blue-400 transition rounded-sm'
                                : 'bg-white text-center border rounded-sm'
                        }
                    >
                        <div className="relative h-full w-full pb-[100%]">
                            <img
                                className="m-auto block max-w-full max-h-full absolute inset-0"
                                src={availableThumbs[0]}
                                alt="thumbnail"
                            />
                            {/* Overlay */}
                            <div className="text-white flex items-center justify-center gap-2 w-full h-full bg-gray-700 absolute z-3 opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition cursor-all-scroll"></div>
                        </div>
                    </div>
                    {/* Others */}
                    <section className="text-center col-span-2">
                        <div className="grid grid-cols-3 gap-3">
                            {filterdImages.map((url) => {
                                return (
                                    <Fragment key={url}>
                                        <div
                                            onClick={() => setSelectedThumb(url)}
                                            className={
                                                selectedThumb === url
                                                    ? 'bg-white text-center border-2 border-blue-400 transition rounded-sm'
                                                    : 'bg-white text-center border rounded-sm'
                                            }
                                        >
                                            <div className="relative h-full w-full pb-[100%]">
                                                <img
                                                    className="m-auto block max-w-full max-h-full absolute inset-0"
                                                    src={url}
                                                    alt="thumbnail"
                                                />
                                                {/* Overlay */}
                                                <div className="text-white flex items-center justify-center gap-2 w-full h-full bg-gray-700 absolute z-3 opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition"></div>
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            })}
                            <label htmlFor="images" className="block">
                                <div className="h-full text-blue-500 gap-2 flex flex-col items-center justify-center p-6 border border-dashed hover:bg-blue-50 transition cursor-pointer rounded-md text-center text-sm">
                                    <h4>Add images</h4>
                                </div>
                            </label>
                            <input
                                multiple
                                onChange={uploadImages}
                                type="file"
                                name="images"
                                id="images"
                                className="hidden"
                            />
                        </div>
                    </section>
                </section>
            </section>
            <section className="flex items-center justify-end gap-2">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition text-sm"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="text-sm bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    Confirm
                </button>
            </section>
        </div>
    );
};

export default UpdateVariantThumb;
