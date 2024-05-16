import { CalendarIcon } from '@heroicons/react/24/outline';
import { getDays, getDatesInMonth } from '~/utils';
import React, { Fragment, useState } from 'react';
import { format, isSameMonth } from 'date-fns';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const DatePicker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const sortedDays = () => {
        let dates = getDatesInMonth(currentDate.getMonth(), currentDate.getFullYear());
        let startDate = dates[0];
        let endDate = dates[dates.length - 1];

        let startDayIndex = dayNames.indexOf(dayNames[startDate.getDay()]);
        let endDayIndex = dayNames.indexOf(dayNames[endDate.getDay()]);

        // Start
        for (let i = 1; i <= startDayIndex; i++) {
            let date = new Date();
            date.setDate(startDate.getDate() - i);
            dates.unshift(date);
        }
        // End
        for (let i = endDayIndex + 1; i < dayNames.length; i++) {
            let date = new Date();
            date.setDate(dates[dates.length - 1].getDate() + 1);
            dates.push(date);
        }
        return dates;
    };

    return (
        <div className="p-4 space-y-6 min-w-[24rem]">
            <div className="gap-2 flex p-2 rounded-md ring-1 ring-slate-300 hover:ring-blue-500 transition">
                <CalendarIcon className="w-5 h-5" />
                <input value={format(currentDate, 'dd/MM/yyyy')} type="text" placeholder="05/06/2024" />
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-7">
                    {dayNames.map((day) => (
                        <Fragment key={day}>
                            <p className="p-2 font-semibold text-center">{day}</p>
                        </Fragment>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {sortedDays().map((date, index) => (
                        <Fragment key={date.getTime()}>
                            <p
                                className={
                                    isSameMonth(currentDate, date)
                                        ? 'text-center p-2 rounded-md hover:bg-blue-50 hover:text-blue-500 transition'
                                        : 'text-center text-slate-400 p-2 rounded-md hover:bg-blue-50 hover:text-blue-500 transition'
                                }
                            >
                                {date.getDate()}
                            </p>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
