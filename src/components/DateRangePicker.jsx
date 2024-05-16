import { Transition } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { format, isEqual, isSameMonth } from 'date-fns';
import { Fragment, useEffect, useRef, useState } from 'react';
import { dateRangeKeys } from '~/store/constants';
import { getDatesInMonth, isDateInRange, isTomorrow } from '~/utils';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const DateRangePicker = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState(() => {
        let startDate = new Date();
        let endDate = new Date();

        return {
            startDate: startDate,
            endDate: endDate,
            isSelecting: false,
        };
    });

    const sortedDays = (currentDate) => {
        const dates = getDatesInMonth(currentDate?.getMonth(), currentDate?.getFullYear());
        let startDate = dates[0];
        let endDate = dates[dates.length - 1];

        let startDateIndex = startDate.getDay();

        for (let i = 1; i <= startDateIndex; i++) {
            let date = new Date();
            date.setDate(startDate.getDate() - i);
            dates.unshift(date);
        }

        let i = 1;
        while (dates.length < 42) {
            let date = new Date();
            date.setDate(endDate.getDate() + i);
            dates.push(date);
            i += 1;
        }

        return dates;
    };

    const pickerRef = useRef();
    const btnRef = useRef();

    const handleOpenDatePicker = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutSide);
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide);
        };
    }, []);

    return (
        <div className="relative date-range-picker">
            <button ref={btnRef} type="button" onClick={handleOpenDatePicker}>
                {children}
            </button>
            <Transition
                as={Fragment}
                show={open}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div ref={pickerRef} className="absolute top-[3rem] rounded-md bg-white py-4 border">
                    <div className="flex gap-2">
                        <div className="min-w-[12rem] px-4 max-h-[23rem] overflow-auto">
                            <ul>
                                {dateRangeKeys.map((key) => (
                                    <Fragment key={key}>
                                        <li className="cursor-pointer rounded-md py-3 px-2 hover:bg-blue-50 transition">
                                            {key}
                                        </li>
                                    </Fragment>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-start justify-between gap-2 col-span-2">
                            {/* Calendar 1 */}
                            <div className="p-4 space-y-6 min-w-[24rem]">
                                <div className="gap-2 flex justify-between p-2 rounded-md ring-1 ring-slate-300 hover:ring-blue-500 transition">
                                    <CalendarIcon className="w-5 h-5" />
                                    <input
                                        value={format(range?.startDate, 'dd/MM/yyyy')}
                                        type="text"
                                        data-value={range.startDate}
                                        readOnly
                                        placeholder="05/06/2024"
                                        className="text-center"
                                        name="startDate"
                                    />
                                    <span className="text-slate-400">to</span>
                                    <input
                                        readOnly
                                        value={format(range?.endDate, 'dd/MM/yyyy')}
                                        type="text"
                                        data-value={range.endDate}
                                        placeholder="05/06/2024"
                                        className="text-center"
                                        name="endDate"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-7">
                                        {dayNames.map((day) => (
                                            <Fragment key={day}>
                                                <p className="font-semibold text-center">{day}</p>
                                            </Fragment>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7">
                                        {sortedDays(range?.startDate).map((date, index) => (
                                            <Fragment key={date.getTime()}>
                                                <p
                                                    onClick={() => {
                                                        let now = new Date();
                                                        if (date.getTime() <= now.getTime()) {
                                                            if (!range.isSelecting) {
                                                                setRange((prev) => ({
                                                                    ...prev,
                                                                    isSelecting: true,
                                                                    startDate: date,
                                                                }));
                                                            } else {
                                                                setRange((prev) => ({
                                                                    ...prev,
                                                                    isSelecting: true,
                                                                    endDate: date,
                                                                }));
                                                            }
                                                        }
                                                    }}
                                                    className={clsx('text-center py-2 rounded-md cursor-pointer', {
                                                        'text-slate-300 hover:bg-blue-50 hover:text-blue-500':
                                                            !isSameMonth(date, range.startDate) && !isTomorrow(date),
                                                        'line-through text-slate-300 cursor-default': isTomorrow(date),
                                                        'hover:bg-blue-50 hover:text-blue-500':
                                                            isSameMonth(date, range.startDate) && !isTomorrow(date),
                                                        'bg-blue-500 text-white':
                                                            isEqual(date, range.startDate) ||
                                                            isEqual(date, range.endDate),
                                                        'bg-blue-50 text-blue-500':
                                                            isDateInRange(date, range.startDate, range.endDate) &&
                                                            !isEqual(date, range.startDate) &&
                                                            !isEqual(date, range.endDate),
                                                    })}
                                                >
                                                    {date.getDate()}
                                                </p>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 px-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setRange({
                                    startDate: new Date(),
                                    endDate: new Date(),
                                    isSelecting: false,
                                });
                                setOpen(false);
                            }}
                            className="px-5 py-2 h transition rounded-sm bg-slate-50 hover:bg-slate-200 border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={() => setOpen(false)}
                            className="px-5 py-2 hover:bg-blue-600 transition rounded-sm bg-blue-500 text-white"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default DateRangePicker;
