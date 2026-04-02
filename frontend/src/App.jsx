import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { WishlistProvider } from './contexts/WishlistContext.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

/* PURE COMPONENTS STRUCTURE EXPORTED DIRECTLY */
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/public/Home.jsx';
import DealsListing from './pages/public/DealsListing.jsx';
import DealsDetail from './pages/public/DealsDetail.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Categories from './pages/public/Categories.jsx';
import CustomerSupport from './pages/public/CustomerSupport.jsx';
import CategoryView from './pages/public/CategoryView.jsx';
import VerifyEmail from './pages/public/VerifyEmail.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
import PartnerPolicies from './pages/public/PartnerPolicies.jsx';
import HowToListDeals from './pages/public/HowToListDeals.jsx';
import PrivacyPolicy from './pages/public/PrivacyPolicy.jsx';
import TermsConditions from './pages/public/TermsConditions.jsx';

/* USER ROLE COMPONENT */
import Wishlist from './pages/user/Wishlist.jsx';
import Profile from './pages/user/Profile.jsx';

/* CLIENT ROLE COMPONENT */
import ClientDashboard from './pages/client/ClientDashboard.jsx';
import AddDeals from './pages/client/AddDeals.jsx';
import ManageDeals from './pages/client/ManageDeals.jsx';
import ClientProfile from './pages/client/ClientProfile.jsx';
import ClientNotifications from './pages/client/ClientNotifications.jsx';
import BannerPromotions from './pages/client/BannerPromotions.jsx';
import DesignSupport from './pages/client/DesignSupport.jsx';

/* ADMIN ROLE COMPONENT */
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageClients from './pages/admin/ManageClients.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import AdminManageDeals from './pages/admin/ManageDeals.jsx';
import ManageSupport from './pages/admin/ManageSupport.jsx';
import ManageDesignRequests from './pages/admin/ManageDesignRequests.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';
import ManageBannerPromotions from './pages/admin/ManageBannerPromotions.jsx';
import AdminHomeRequests from './pages/admin/AdminHomeRequests.jsx';
import ClientProtectedRoute from './components/common/ClientProtectedRoute.jsx';
import { cleanupExpiredDeals } from './utils/dealUtils';

import './index.css';

function App() {
  useEffect(() => {
    // Automatically cleanup expired deals on app load
    cleanupExpiredDeals();
  }, []);

  const googleClientId = "291951243572-uhev41trorb96u6prkfaufms46pei703.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LanguageProvider>
        <AuthProvider>
          <WishlistProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Routes>
                {/* EVERYTHING IN MAIN LAYOUT (HEADER/FOOTER) BY DEFAULT */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/deals-listing" element={<DealsListing />} />
                  <Route path="/deal/:id" element={<DealsDetail />} />
                  <Route path="/deals" element={<DealsListing />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/category/:slug" element={<CategoryView />} />
                  <Route path="/support" element={<CustomerSupport />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/partner-policies" element={<PartnerPolicies />} />
                  <Route path="/how-to-list-deals" element={<HowToListDeals />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />

                  {/* AUTH ROUTES BACK IN MAIN LAYOUT */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* CLIENT DASHBOARD WORKFLOWS */}
                <Route element={<ClientProtectedRoute />}>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/client/add-deal" element={<AddDeals />} />
                  <Route path="/client/manage-deals" element={<ManageDeals />} />
                  <Route path="/client/profile" element={<ClientProfile />} />
                  <Route path="/client/notifications" element={<ClientNotifications />} />
                  <Route path="/client/banner-promotions" element={<BannerPromotions />} />
                  <Route path="/client/design-support" element={<DesignSupport />} />
                </Route>

                {/* REDIRECTS FOR OLD ROUTES */}
                <Route path="/client/add-product" element={<Navigate to="/client/add-deal" replace />} />
                <Route path="/client/products" element={<Navigate to="/client/manage-deals" replace />} />
                <Route path="/admin/products" element={<Navigate to="/admin/manage-deals" replace />} />

                {/* ADMIN DASHBOARD WORKFLOWS */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/home-requests" element={<AdminHomeRequests />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/clients" element={<ManageClients />} />
                  <Route path="/admin/manage-deals" element={<AdminManageDeals />} />
                  <Route path="/admin/categories" element={<ManageCategories />} />
                  <Route path="/admin/banners" element={<ManageBannerPromotions />} />
                  <Route path="/admin/design-requests" element={<ManageDesignRequests />} />
                  <Route path="/admin/support" element={<ManageSupport />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Router>
          </WishlistProvider>
        </AuthProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;


