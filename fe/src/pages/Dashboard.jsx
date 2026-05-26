import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { format, isSameDay } from 'date-fns';
import { useState } from 'react';
import { DateRangePicker } from '~/components';
import { NewCustomers, NumOrders, Revenue, TopSellingProducts } from '~/components/statistics';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { DashboardContext } from '~/contexts/pool';
import { hasChangedPassword } from '~/utils';
import NotAllowAccess from './NotAllowAccess';

const Dashboard = () => {
    const { user } = UserAuth();

    const [currentTime, setCurrentTime] = useState({
        from: new Date(),
        to: new Date(),
    });
    const [compareTime, setCompareTime] = useState(null);

    const handleSubmitCurrentTime = (e) => {
        e.preventDefault();
        setCurrentTime({
            from: e.target['startDate'].getAttribute('data-value'),
            to: e.target['endDate'].getAttribute('data-value'),
        });
    };

    const handleSubmitCompareTime = (e) => {
        e.preventDefault();
        setCompareTime({
            from: e.target['startDate'].getAttribute('data-value'),
            to: e.target['endDate'].getAttribute('data-value'),
        });
    };

    return !hasChangedPassword(user) ? (
        <NotAllowAccess />
    ) : (
        <section className="h-screen-content overflow-auto flex justify-center text-sm">
            <DashboardContext.Provider value={{ currentTime, compareTime }}>
                <section className="container pt-6 px-4 space-y-4">
                    {/* Filter */}
                    <section className="bg-white rounded-md p-4 flex items-center gap-2 shadow-sm">
                        <form onSubmit={handleSubmitCurrentTime}>
                            <DateRangePicker>
                                <div className="hover:ring-blue-500 ring-1 ring-transparent transition gap-12 flex items-center justify-between p-2 rounded-sm border bg-white">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                                isSameDay(currentTime.from, new Date()) &&
                                                isSameDay(currentTime.to, new Date())
                                                    ? 'Today'
                                                    : `${format(currentTime.from, 'dd/MM/yyyy')} - ${format(
                                                          currentTime.to,
                                                          'dd/MM/yyyy',
                                                      )}`
                                            }
                                        />
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </div>
                            </DateRangePicker>
                        </form>
                        <form onSubmit={handleSubmitCompareTime}>
                            <DateRangePicker>
                                <div className="hover:ring-blue-500 ring-1 ring-transparent transition flex items-center justify-between p-2 rounded-sm border bg-white">
                                    <div className="flex items-center gap-2">
                                        <p>Compare:</p>
                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                                compareTime?.from && compareTime?.to
                                                    ? `${format(compareTime.from, 'dd/MM/yyyy')} - ${format(
                                                          compareTime.to,
                                                          'dd/MM/yyyy',
                                                      )}`
                                                    : 'No choose'
                                            }
                                        />
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </div>
                            </DateRangePicker>
                        </form>
                    </section>
                    {/* Statistic */}
                    <section className="space-y-4">
                        <section className="grid grid-cols-4 gap-4">
                            <Revenue />
                            <NumOrders />
                            <NewCustomers />
                        </section>
                        <section className="grid grid-cols-12 gap-4">
                            <div className="col-span-5">
                                <TopSellingProducts />
                            </div>
                        </section>
                    </section>
                </section>
            </DashboardContext.Provider>
        </section>
    );
};

export default Dashboard;
