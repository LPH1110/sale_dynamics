import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './store';
import AuthProvider from './contexts/AuthContext/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <AuthProvider>
            <StoreProvider>
                <App />
            </StoreProvider>
        </AuthProvider>
    </Router>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
