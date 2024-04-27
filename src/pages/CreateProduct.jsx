import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
    CalculationUnit,
    CreateProductHeader,
    CreateProductProperties,
    CreateProductThumbnail,
    GeneralProductInfo,
    InventoryManagement,
    Modal,
    ProductPrice,
} from '~/components';
import { propertyNames } from '~/store/constants';
import { request } from '~/utils';

const CreateProduct = () => {
    const [productInfo, setProductInfo] = useState({
        name: '',
        provider: '',
        category: '',
        description: '',
        thumbnails: [],
        salePrice: 0,
        comparedPrice: 0,
        sku: '',
        barcode: '',
        baseUnit: '',
        properties: [
            {
                name: propertyNames[Math.floor(Math.random() * propertyNames.length)],
                tags: ['Sample tag'],
            },
        ],
    });

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            productName: '',
            salePrice: 0,
            comparedPrice: 0,
            barcode: '',
        },
        validationSchema: Yup.object({
            productName: Yup.string().required('Product name is required'),
            salePrice: Yup.number('Sale price must be a number type')
                .required('Amount is required')
                .positive('Amount must be positive')
                .min(1000, 'Amount must be higher than 1.000 vnđ'),
            comparedPrice: Yup.number('Compared price must be a number type')
                .required('Amount is required')
                .positive('Amount must be positive')
                .min(1000, 'Amount must be higher than 1.000 vnđ')
                .moreThan(productInfo.salePrice, 'Amount must be higher than sale price'),
            barcode: Yup.string().required('Barcode is required'),
        }),
    });

    const changeCreateProductInfo = (prop, value) => {
        switch (prop) {
            case 'thumbnails':
                setProductInfo((prev) => {
                    return {
                        ...prev,
                        thumbnails: [...prev.thumbnails, ...value],
                    };
                });
                break;
            case 'properties':
                setProductInfo((prev) => {
                    return {
                        ...prev,
                        properties: [...prev.properties, ...value],
                    };
                });
                break;
            case 'salePrice':
            case 'comparedPrice':
                if (productInfo[prop] !== value) {
                    setProductInfo((prev) => {
                        return {
                            ...prev,
                            [prop]: value,
                        };
                    });
                }
                break;
            default:
                if (productInfo[prop].localeCompare(value) !== 0) {
                    setProductInfo((prev) => {
                        return {
                            ...prev,
                            [prop]: value,
                        };
                    });
                }
                break;
        }
    };

    return (
        <section className="h-screen-content overflow-auto">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 relative h-full">
                <CreateProductHeader productInfo={productInfo} />
                <section className="flex items-center justify-center">
                    <section className="container grid grid-cols-4 px-4 gap-6">
                        <section className="space-y-4 col-span-3">
                            <GeneralProductInfo handleChangeProductInfo={changeCreateProductInfo} formik={formik} />
                            <CreateProductThumbnail
                                setOpenModal={setOpenModal}
                                setModalAction={setModalAction}
                                initial={productInfo.thumbnails}
                                handleChangeProductInfo={changeCreateProductInfo}
                            />
                            <ProductPrice
                                initial={{
                                    salePrice: productInfo.salePrice,
                                    comparedPrice: productInfo.comparedPrice,
                                }}
                                formik={formik}
                                handleChangeProductInfo={changeCreateProductInfo}
                            />
                            <InventoryManagement
                                initial={{
                                    sku: productInfo.sku,
                                    barcode: productInfo.barcode,
                                }}
                                formik={formik}
                                handleChangeProductInfo={changeCreateProductInfo}
                            />
                            <CalculationUnit
                                initial={productInfo.baseUnit}
                                handleChangeProductInfo={changeCreateProductInfo}
                            />
                            <CreateProductProperties
                                properties={productInfo.properties}
                                setProductInfo={setProductInfo}
                            />
                        </section>
                        {/* <section>
                            <div className="bg-white h-24 rounded-md border shadow-md"></div>
                        </section> */}
                    </section>
                </section>
                <Modal
                    setCreateProductInfo={setProductInfo}
                    open={openModal}
                    setOpen={setOpenModal}
                    action={modalAction}
                />
            </form>
        </section>
    );
};

export default CreateProduct;
