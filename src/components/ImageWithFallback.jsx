import { useEffect, useState } from 'react';
import images from '~/assets';

const ImageWithFallback = ({ fallback = images.fallback, alt, src, ...props }) => {
    const [error, setError] = useState(null);

    console.log(fallback);

    useEffect(() => {
        setError(null);
    }, [src]);

    return <image alt={alt} onError={setError} src={error ? fallback : src} {...props} />;
};

export default ImageWithFallback;
