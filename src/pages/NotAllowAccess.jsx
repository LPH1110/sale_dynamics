import React from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';
import { hasChangedPassword } from '~/utils';

const NotAllowAccess = ({ children }) => {
    const { user } = UserAuth();

    return !hasChangedPassword(user) ? (
        <div className="flex items-center justify-center p-6 h-screen-content">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">This site is blocked</h1>
                <p className="text-gray-600 text-lg my-4">
                    We are sorry for this inconvenience. You haven't changed your password to access this page.
                </p>
                <Link
                    to={`/change-password/${user.username}`}
                    className="text-blue-500 hover:text-blue-600 transition text-center"
                >
                    Change your password
                </Link>
            </div>
        </div>
    ) : (
        children
    );
};

export default NotAllowAccess;
