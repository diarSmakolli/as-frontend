import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./features/administration/authContext/authContext";
import { Navigate } from "react-router-dom";
import {
  CustomerAuthProvider, useCustomerAuth
} from "./features/customer-account/auth-context/customerAuthContext";
import Login from "./features/administration/login/Login";
import Home from "./features/home/Home";
import Loader from "./commons/Loader";
import Dashboard from "./features/administration/dashboard/Dashboard";
import { PreferencesProvider } from "./features/administration/authContext/preferencesProvider";
import AdministrationsList from "./features/administration/administrations-management/AdministrationsList";
import AdministrationDetails from "./features/administration/administrations-details/AdministrationDetails";
import CompaniesList from "./features/company/companies-management/CompaniesList";
import CompanyDetails from "./features/company/company-details/CompanyDetails";
import TaxesList from "./features/tax/tax-management/TaxesList";
import CategoryList from "./features/category/category-management/CategoryManagement";
import CreateProductPage from "./features/product/create-product/CreateProductPage";
import ProductsPage from "./features/product/ProductsPage";
import ProductDetailsPage from "./features/product/ProductDetailsPage";
import EditProductPage from "./features/product/edit-product/EditProductPage";
import CustomerProductPage from "./features/customer-product/CustomerProductPage";
import CustomerSearchPage from "./features/customer-product/CustomerSearchPage";
import CustomerCategoryPage from "./features/customer-product/CustomerCategoryPage";
import CustomerDealsPage from "./features/customer-product/CustomerDealsPage";
import Error404 from "./commons/components/Error404";
import RegisterAccount from "./features/customer-account/RegisterAccount";
import LoginAccount from "./features/customer-account/LoginAccount";
import ProfileAccount from "./features/customer-account/ProfileAccount";
import VerifyEmail from "./features/customer-account/verifyEmail";
import ForgotPassword from "./features/customer-account/ForgotPassword";
import ResetPassword from "./features/customer-account/ResetPassword";
import WishlistItems from "./features/customer-account/WishlistItems";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/checkout/CheckoutPage";
import PromotionPage from "./features/promotion/PromotionPage";
import GiftCardPage from "./features/giftcards/GiftCardPage";
import CustomersPage from "./features/customer-admin/CustomersPage";
import CustomerDetails from "./features/customer-admin/CustomerDetails";
import OrderDetailed from "./features/order-admin/OrderDetailed";
import OrderList from "./features/order-admin/OrderList";

function App() {
  return (
    <>
      <AuthProvider>
        <PreferencesProvider>
          <CustomerAuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/gestionnaire"
                  element={
                    <IsAuthenticated>
                      <Login />
                    </IsAuthenticated>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/administrations-console"
                  element={
                    <PrivateRoute>
                      <AdministrationsList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/administrations-console/detailed/:accountId"
                  element={
                    <PrivateRoute>
                      <AdministrationDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/companies-console"
                  element={
                    <PrivateRoute>
                      <CompaniesList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/company-details/:companyId"
                  element={
                    <PrivateRoute>
                      <CompanyDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/taxes-console"
                  element={
                    <PrivateRoute>
                      <TaxesList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/category-console"
                  element={
                    <PrivateRoute>
                      <CategoryList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-product"
                  element={
                    <PrivateRoute>
                      <CreateProductPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products-console"
                  element={
                    <PrivateRoute>
                      <ProductsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products-console/:productId"
                  element={
                    <PrivateRoute>
                      <ProductDetailsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products-console/:productId/edit"
                  element={
                    <PrivateRoute>
                      <EditProductPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/product/:slug"
                  element={<CustomerProductPage />}
                />
                <Route path="/search" element={<CustomerSearchPage />} />
                <Route
                  path="/category/:slug"
                  element={<CustomerCategoryPage />}
                />
                <Route path="/flash-deals" element={<CustomerDealsPage />} />
                <Route
                  path="/account/register"
                  element={
                    <CustomerIsAuthenticated>
                      <RegisterAccount />
                    </CustomerIsAuthenticated>
                  }
                />
                <Route
                  path="/account/signin"
                  element={
                    <CustomerIsAuthenticated>
                      <LoginAccount />
                    </CustomerIsAuthenticated>
                  }
                />
                <Route path='/account/profile'
                  element={
                    <PrivateRouteForCustomer>
                      <ProfileAccount />
                    </PrivateRouteForCustomer>
                  } 
                />
                <Route path='/account/verify-email' element={<VerifyEmail /> } />
                <Route path='/account/forgot-password' element={<ForgotPassword /> } />
                <Route path='/account/reset-password' element={<ResetPassword />} />
                <Route path='/account/wishlist' element={<PrivateRouteForCustomer><WishlistItems /></PrivateRouteForCustomer>} />
                <Route path='/cart' element={<PrivateRouteForCustomer><CartPage /></PrivateRouteForCustomer>} />
                <Route path='/checkout/confirm' element={<PrivateRouteForCustomer><CheckoutPage /></PrivateRouteForCustomer>} />
                <Route path='/promotions' element={<PrivateRoute><PromotionPage /></PrivateRoute>} />
                <Route path='/gift-cards' element={<PrivateRoute><GiftCardPage /></PrivateRoute>} />
                <Route path='/customers' element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
                <Route path='/customer-details/:customerId' element={<PrivateRoute><CustomerDetails /></PrivateRoute>} />
                <Route path='/order-details/:orderId' element={<PrivateRoute><OrderDetailed /></PrivateRoute>} />
                <Route path='/orders' element={<PrivateRoute><OrderList /></PrivateRoute>} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </Router>
          </CustomerAuthProvider>
        </PreferencesProvider>
      </AuthProvider>
    </>
  );
}

const PrivateRoute = ({ children }) => {
  const { account, isLoading, logout } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return account ? children : <Navigate to="/" />;
};

const IsAuthenticated = ({ children }) => {
  const { account, isLoading, logout } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return !account ? children : <Navigate to="/dashboard" />;
};

const CustomerIsAuthenticated = ({ children }) => {
  const { customer, isLoading } = useCustomerAuth();

  if (isLoading) {
    return <Loader />;
  }

  // If already logged in as customer, redirect to home (or /account, etc.)
  return customer ? <Navigate to="/" /> : children;
};

const PrivateRouteForCustomer = ({ children }) => {
  const { customer, isLoading } = useCustomerAuth();

  if(isLoading) {
    return <Loader />
  }

  return customer ? children : <Navigate to='/' />;
}

export default App;
