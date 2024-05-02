import axios from 'axios';
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
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
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
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Product name is required'),
            salePrice: Yup.number('Sale price must be a number type')
                .required('Amount is required')
                .positive('Amount must be positive')
                .min(1000, 'Amount must be higher than 1.000 vnđ'),
            comparedPrice: Yup.number('Compared price must be a number type')
                .required('Amount is required')
                .positive('Amount must be positive')
                .min(1000, 'Amount must be higher than 1.000 vnđ'),
            barcode: Yup.string().required('Barcode is required'),
        }),
        onSubmit: (data) => {
            console.log(data);
            // const handleSubmit = async () => {
            //     setIsLoading(true);
            //     await request.post('products/save', JSON.stringify(productInfo));
            //     productInfo.thumbnails.forEach(async (file, index) => {
            //         let formData = new FormData();
            //         formData.append('barcode', productInfo.barcode);
            //         formData.append(`thumbnail`, file, file.name);
            //         await axios.post(`${process.env.REACT_APP_SERVER_BASE}/products/save-thumbnail`, formData, {
            //             headers: {
            //                 Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
            //                 'Content-Type': 'multipart/form-data;charset=UTF-8',
            //             },
            //         });
            //     });
            //     toast.success('Create new product successfully');
            //     navigate(`/products/detail/${productInfo.barcode}`);
            //     setIsLoading(false);
            // };
        },
    });

    return (
        <section className="h-screen-content overflow-auto">
            <form onSubmit={formik.handleSubmit} className="space-y-6 relative h-full">
                <CreateProductHeader isLoading={isLoading} />
                <section className="flex items-center justify-center">
                    <section className="container grid grid-cols-4 px-4 gap-6">
                        <section className="space-y-4 col-span-3">
                            {/* <GeneralProductInfo
                                productDetail={productInfo}
                                formik={formik}
                            />
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
                            /> */}
                        </section>
                        {/* <section>
                            <div className="bg-white h-24 rounded-md border shadow-md"></div>
                        </section> */}
                    </section>
                </section>
                {/* <Modal
                    setCreateProductInfo={setProductInfo}
                    open={openModal}
                    setOpen={setOpenModal}
                    action={modalAction}
                /> */}
            </form>
        </section>
    );
};

export default CreateProduct;
