import React, { Fragment } from 'react';
import { GalleryThumb } from '~/components';

const GalleryCard = ({ clearImage, images = [] }) => {
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

export default GalleryCard;
