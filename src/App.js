import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';
import ProtectedRoute from './routes/ProtectedRoute';
import Authority from './routes/Authority';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div className="App">
            <Routes>
                {publicRoutes.map((route) => {
                    const Layout = route.layout;
                    const Page = route.page;
                    switch (route.path) {
                        case '/':
                            return (
                                <Route
                                    exact
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                            );
                        default:
                            return route.protected ? (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                            ) : (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                    }
                })}
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
