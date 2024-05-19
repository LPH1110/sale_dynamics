import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import AccountDetailContext from '~/contexts/pool/AccountDetailContext';
import { Spinner } from '~/icons';
import { jsonToFormData, request } from '~/utils';

const ChangeAvatar = ({ setOpen }) => {
    const { avatar, setAccount } = useContext(AccountDetailContext);
    const [url, setURL] = useState(URL.createObjectURL(avatar));
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [aspect, setAspect] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [croppedRatio, setCroppedRatio] = useState(null);
    const { user } = UserAuth();

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedRatio(croppedArea);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const handleUpload = async () => {
        try {
            setIsLoading(true);
            const formData = jsonToFormData({
                thumbnail: avatar,
                crop: croppedRatio,
                username: user?.username,
            });

            console.log(formData.get('crop'));

            const res = await axios.post(`${process.env.REACT_APP_SERVER_BASE}/user/change-avatar`, formData, {
                headers: {
                    Authorization: 'Bearer ' + window.localStorage.getItem('jwt'),
                    'Content-Type': 'multipart/form-data;charset=UTF-8',
                },
            });

            setAccount((prev) => ({
                ...prev,
                avatarURL: res.data.url,
            }));
        } catch (error) {
            console.error('Failed to change avatar', error);
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
            setURL('');
        };
    }, []);

    return (
        <div className="w-full">
            <section className="flex items-center justify-between px-4">
                <h2 className="font-semibold capitalize">Change avatar</h2>
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="text-gray-300 hover:text-gray-500 transition"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </section>

            <section className="my-4 py-2 border flex flex-col items-center gap-4">
                <div className="relative w-[250px] h-[250px]">
                    <Cropper
                        image={url}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={onCropChange}
                        onCropComplete={onCropComplete}
                        onZoomChange={onZoomChange}
                    />
                </div>
                <div>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                    />
                </div>
            </section>

            <section className="flex items-center justify-end gap-2 px-4">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="rounded-sm border py-2 px-4 hover:bg-gray-100 transition text-sm"
                >
                    Close
                </button>
                <button
                    type="button"
                    onClick={handleUpload}
                    className="text-sm bg-blue-500 min-w-[4rem] flex justify-center items-center hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-sm"
                >
                    {isLoading ? <Spinner /> : 'Upload'}
                </button>
            </section>
        </div>
    );
};

export default ChangeAvatar;
