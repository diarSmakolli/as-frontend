import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import {
  AuthProvider,
  useAuth,
} from "./features/administration/authContext/authContext";
import { Navigate } from "react-router-dom";
import {
  CustomerAuthProvider,
  useCustomerAuth,
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
import CheckoutSuccess from "./features/checkout/CheckoutSuccess";
import OrderCancelled from "./features/checkout/OrderCancelled";
import RoleProtectedRoute from "./features/administration/authContext/RoleProtectedRoute";
import TOS from "./features/tos/TOS";
import PrivacyTOS from "./features/tos/PrivacyTOS";
import ReactGA from "react-ga4";

ReactGA.initialize("G-48VG8VBG33");

function Analytics() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
}

function App() {
  return (
      <HelmetProvider>
        <AuthProvider>
          <PreferencesProvider>
            <CustomerAuthProvider>
              <Router>
                <Analytics />
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
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <AdministrationsList />
                      </RoleProtectedRoute>
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
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <CompaniesList />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/company-details/:companyId"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <CompanyDetails />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/taxes-console"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <TaxesList />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/category-console"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <CategoryList />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-product"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <CreateProductPage />
                      </RoleProtectedRoute>
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
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <ProductDetailsPage />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products-console/:productId/edit"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <EditProductPage />
                      </RoleProtectedRoute>
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
                <Route
                  path="/account/profile"
                  element={
                    <PrivateRouteForCustomer>
                      <ProfileAccount />
                    </PrivateRouteForCustomer>
                  }
                />
                <Route path="/account/verify-email" element={<VerifyEmail />} />
                <Route
                  path="/account/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/account/reset-password"
                  element={<ResetPassword />}
                />
                <Route
                  path="/account/wishlist"
                  element={
                    <PrivateRouteForCustomer>
                      <WishlistItems />
                    </PrivateRouteForCustomer>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRouteForCustomer>
                      <CartPage />
                    </PrivateRouteForCustomer>
                  }
                />
                <Route
                  path="/checkout/confirm"
                  element={
                    <PrivateRouteForCustomer>
                      <CheckoutPage />
                    </PrivateRouteForCustomer>
                  }
                />
                <Route
                  path="/promotions"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <PromotionPage />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/gift-cards"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <GiftCardPage />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <PrivateRoute>
                      <CustomersPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customer-details/:customerId"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <CustomerDetails />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-details/:orderId"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <OrderDetailed />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <RoleProtectedRoute
                        allowedRoles={["administrator", "global-administrator"]}
                      >
                        <OrderList />
                      </RoleProtectedRoute>
                    </PrivateRoute>
                  }
                />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route
                  path="/checkout/order-cancelled"
                  element={<OrderCancelled />}
                />
                <Route path="/terms-and-conditions" element={<TOS />} />
                 <Route path="/privacy-policy" element={<PrivacyTOS />} />
                <Route path="*" element={<Error404 />} />
                </Routes>
              </Router>
            </CustomerAuthProvider>
          </PreferencesProvider>
        </AuthProvider>
      </HelmetProvider>
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

  if (isLoading) {
    return <Loader />;
  }

  return customer ? children : <Navigate to="/" />;
};

export default App;
