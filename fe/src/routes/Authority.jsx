import { Link } from 'react-router-dom';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';

const Authority = ({ children }) => {
    const { user } = UserAuth();

    // if (user?.isAdmin) return children;
    if (user?.isAdmin) return children;

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">You are not allowed to use this function.</h2>
            <p className="text-sm">
                Please{' '}
                <Link to="/sign-in" className="text-blue-500 hover:underline">
                    sign in
                </Link>{' '}
                as Account Manager.
            </p>
        </section>
    );
};

export default Authority;
