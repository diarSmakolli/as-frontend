import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./features/administration/authContext/authContext";
import { Navigate } from "react-router-dom";
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

function App() {
  return (
    <>
      <AuthProvider>
        <PreferencesProvider>
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
              <Route path="/product/:slug" element={<CustomerProductPage />} />
              <Route path="/search" element={<CustomerSearchPage />} />
              <Route
                path="/category/:slug"
                element={<CustomerCategoryPage />}
              />
              <Route path="/flash-deals" element={<CustomerDealsPage />} />
            </Routes>
          </Router>
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

export default App;
