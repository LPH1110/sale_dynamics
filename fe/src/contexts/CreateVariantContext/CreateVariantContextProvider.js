const { useState, useContext } = require('react');
const { default: CreateVariantContext } = require('./CreateVariantContext');

const CreateVariantContextProvider = ({ children }) => {
    const [availableThumbs, setAvailableThumbs] = useState([
        'https://product.hstatic.net/200000871597/product/50_8951ad29-fafc-4310-b615-ae133ce1e6d5_0de6e9f49e11482c833f23c445bab327_large.jpg',
        'https://product.hstatic.net/200000871597/product/mug-today-is-a-good-day_30d300af56464d74988008b6514d169b_small.jpg',
        'https://product.hstatic.net/200000871597/product/48_26d411fb-fc77-4725-a0d3-5864342cb5ac_8f37d78e42004fbf9299b31919ac1221_small.jpg',
        'https://product.hstatic.net/200000871597/product/49_58df399e-061c-438a-b22d-8d514ca1904a_3acf106223f242e89330b9841007710d_small.jpg',
    ]);
    const [selectedThumb, setSelectedThumb] = useState('');

    return (
        <CreateVariantContext.Provider
            value={{
                selectedThumb,
                setSelectedThumb,
                availableThumbs,
                setAvailableThumbs,
            }}
        >
            {children}
        </CreateVariantContext.Provider>
    );
};

export const useCreateVariantContext = () => {
    const context = useContext(CreateVariantContext);
    return context;
};
export default CreateVariantContextProvider;
