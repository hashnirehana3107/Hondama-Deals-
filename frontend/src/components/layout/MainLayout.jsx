import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user && user.role?.toLowerCase() === 'admin') {
            // Admins should stay in the admin panel
            if (!location.pathname.startsWith('/admin')) {
                navigate('/admin/dashboard');
            }
        }
    }, [user, loading, navigate, location]);

    return (
        <div className="layout-wrapper">
            <Header />
            <main className="layout-main page-fade-in">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
