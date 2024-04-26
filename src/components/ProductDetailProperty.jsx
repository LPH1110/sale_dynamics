import { TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { ProductSavedProperty } from '~/components';
import ProductPropertyTag from './ProductPropertyTag';
import Tooltip from './Tooltip';
import { actions, useStore } from '~/store';
import axios from 'axios';

const ProductProperty = ({ index, tags, propertyName, handleSaveProperty, handleDeleteProperty }) => {
    const [propName, setPropName] = useState(propertyName);
    const [state, dispatch] = useStore();
    const { productDetail } = state;
    const [saved, setSaved] = useState(true);
    const addTagInput = useRef();
    // const [tags, setTags] = useState([])

    console.log(propertyName);

    useEffect(() => {
        setPropName(propertyName);
    }, [propertyName]);

    const handleChangeNewTag = (e) => {
        let newTagInput = e.target;
        if (newTagInput.value !== '' && ((newTagInput && e.keyCode === 13) || e.type === 'blur')) {
            handleAddTag(newTagInput.value);
            newTagInput.value = '';
            newTagInput.focus();
        }
    };

    const handleChangeTag = (tagIndex, value) => {
        let next = productDetail.properties;
        next[index].tags[tagIndex] = value;
        dispatch(actions.setProductDetail({ properties: next }));
    };

    const handleAddTag = (newTag) => {
        let next = productDetail.properties;
        next[index].tags = [...next[index].tags, newTag];
        dispatch(actions.setProductDetail({ properties: next }));
    };

    const handleDeleteTag = (targetTag) => {
        let next = productDetail.properties;
        next[index].tags = next[index].tags.filter((tag) => tag !== targetTag);
        dispatch(actions.setProductDetail({ properties: next }));
    };

    // useEffect(() => {
    //     const fetchTags = async () => {
    //         try {
    //             const res = await axios.get(
    //                 `${process.env.REACT_APP_SERVER_BASE}/tags/get_by_property_id.php?property_id=${property.id}`,
    //             );
    //             if (res.data) {
    //                 setTags(res.data);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchTags()
    // }, []);

    return saved ? (
        <Fragment key={propertyName}>
            <ProductSavedProperty propertyName={propertyName} tags={tags} setSaved={setSaved} />
        </Fragment>
    ) : (
        <Fragment key={propertyName}>
            <div className="grid grid-cols-4 gap-8">
                <div className="flex items-start gap-3">
                    <input
                        id={propertyName}
                        name={propertyName}
                        type="text"
                        value={propName}
                        onChange={(e) => setPropName(e.target.value)}
                        autoComplete="off"
                        className="border w-full p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
                    />
                    <Tooltip placement="top" message="Delete this property">
                        <button
                            onClick={() => handleDeleteProperty(index)}
                            type="button"
                            className="text-red-500 hover:bg-red-50 p-3 rounded-md"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
                <div className="col-span-2 gap-4 flex flex-col">
                    {tags.map((tag, index) => {
                        return (
                            <Fragment key={tag}>
                                <ProductPropertyTag
                                    tag={tag}
                                    index={index}
                                    handleDeleteTag={handleDeleteTag}
                                    handleChangeTag={handleChangeTag}
                                />
                            </Fragment>
                        );
                    })}
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            id="add_new_tag"
                            name="add_new_tag"
                            placeholder="Enter new tag"
                            autoComplete="off"
                            ref={addTagInput}
                            onKeyUp={handleChangeNewTag}
                            className="w-full border p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition"
                        />
                        <div className="w-4 h-4"></div>
                    </div>
                </div>
            </div>
            {/* Save button goes here */}
            <div className="grid grid-cols-4 gap-8">
                <div></div>
                <div className="col-span-2">
                    <button
                        type="button"
                        onClick={() => {
                            handleSaveProperty(index, propName, tags);
                            console.log(addTagInput.current.value);
                            if (addTagInput.current.value !== '') {
                                handleAddTag(addTagInput.current.value);
                            }
                            setSaved(true);
                        }}
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded-md text-sm hover:bg-blue-500 hover:text-white transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default memo(ProductProperty);
