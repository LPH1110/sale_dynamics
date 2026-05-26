import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
    CalculationUnit,
    CreateProductHeader,
    CreateProductThumbnail,
    GeneralProductInfo,
    InventoryManagement,
    Modal,
    ProductDetailProperties,
    ProductPrice,
    ProductThumbnail,
} from '~/components';
import { CreateProductContext } from '~/contexts/pool';
import { sampleProductDetail } from '~/store/constants';
import { request } from '~/utils';

const CreateProduct = () => {
    const [productDetail, setProductDetail] = useState(sampleProductDetail);
    const [productChanged, setProductChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({
        action: '',
        open: false,
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newProductDetail = Object.keys(productDetail).reduce((acc, key) => {
            if (e.target[key]) {
                return {
                    ...acc,
                    [key]: e.target[key].value,
                };
            } else {
                return { ...acc };
            }
        }, {});

        const data = { ...productDetail, ...newProductDetail };

        console.log(data);
        await request.post('products/save', JSON.stringify(data));
        data?.thumbnails.forEach(async (file, index) => {
            let formData = new FormData();
            formData.append('barcode', data?.barcode);
            formData.append(`thumbnail`, file, file.name);
            await axios.post(`${process.env.REACT_APP_SERVER_BASE}/products/save-thumbnail`, formData, {
                headers: {
                    Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
                    'Content-Type': 'multipart/form-data;charset=UTF-8',
                },
            });
        });
        toast.success('Create new product successfully');
        setIsLoading(false);
        navigate(`/products/detail/${data?.barcode}`);
    };

    return (
        <CreateProductContext.Provider value={{ productDetail, setProductDetail }}>
            <section className="h-screen-content overflow-auto">
                <form onSubmit={handleSubmit} className="space-y-6 relative h-full">
                    <CreateProductHeader isLoading={isLoading} />
                    <section className="flex items-center justify-center">
                        <section className="container grid grid-cols-4 px-4 gap-6">
                            <section className="space-y-4 col-span-3">
                                <GeneralProductInfo productDetail={productDetail} setProductDetail={setProductDetail} />
                                <ProductPrice productDetail={productDetail} setProductDetail={setProductDetail} />
                                <InventoryManagement
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                />
                                <CreateProductThumbnail
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                    setModal={setModal}
                                />
                                <CalculationUnit productDetail={productDetail} setProductDetail={setProductDetail} />
                                <ProductDetailProperties
                                    productDetail={productDetail}
                                    setProductDetail={setProductDetail}
                                />
                            </section>
                            {/* <section>
                                <div className="bg-white h-24 rounded-md border shadow-md"></div>
                            </section> */}
                        </section>
                    </section>
                    <Modal
                        open={modal.open}
                        action={modal.action}
                        setOpen={(value) => setModal((prev) => ({ ...prev, open: value }))}
                    />
                </form>
            </section>
        </CreateProductContext.Provider>
    );
};

export default CreateProduct;
