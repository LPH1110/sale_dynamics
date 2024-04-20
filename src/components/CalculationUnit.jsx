import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Tooltip } from '~/components';
import { QuestionMarkCircleIcon } from '~/icons';

const CalculationUnit = ({ initial = '', handleChangeProductInfo }) => {
    const [showBaseUnit, setShowBaseUnit] = useState(false);
    const handleOnBlur = (propName, value) => {
        if (initial.localeCompare(value) !== 0) {
            handleChangeProductInfo(propName, value);
        }
    };
    return (
        <section className="w-full bg-white rounded-sm shadow-md border p-4">
            <div className="flex gap-2 items-center">
                <label className="font-semibold block text-sm text-gray-600" htmlFor="thumbnails">
                    Calculation unit
                </label>
            </div>
            <div className="h-[1px] my-4 w-full bg-gray-100"></div>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        onChange={() => setShowBaseUnit((prev) => !prev)}
                        type="checkbox"
                        name="unitcb"
                        id="unitcb"
                    />
                    <label htmlFor="unitcb" className="text-sm">
                        This product has many calculation units (such as can, box,...)
                    </label>
                </div>
                <Transition
                    as={Fragment}
                    show={showBaseUnit}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="space-y-2 inline-block">
                        <div className="flex items-center gap-2">
                            <label htmlFor="provider" className="font-semibold block text-sm text-gray-600">
                                Base unit
                            </label>
                            <Tooltip placement="top" message="Smallest base unit such as: can, box,...">
                                <button type="button" className="w-4 h-4 text-blue-500">
                                    <QuestionMarkCircleIcon />
                                </button>
                            </Tooltip>
                        </div>

                        <div className="flex items-center border p-2 rounded-sm ring-2 ring-transparent focus-within:ring-blue-400 transition">
                            <input
                                className="w-full"
                                type="text"
                                placeholder="Enter base unit"
                                name="baseUnit"
                                id="baseUnit"
                                onBlur={(e) => handleOnBlur('baseUnit', e.target.value)}
                            />
                        </div>
                    </div>
                </Transition>
            </div>
        </section>
    );
};

export default CalculationUnit;
