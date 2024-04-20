import { Navigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/AuthContext/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();
    console.log(user);

    if (!user) return <Navigate to="/sign-in" />;

    return children;
};

export default ProtectedRoute;
