import React from 'react';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';

const Dashboard = () => {
    const { user } = UserAuth();
    return (
        <section>
            <h1>You are in dashboard</h1>
        </section>
    );
};

export default Dashboard;
