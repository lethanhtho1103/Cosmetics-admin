import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import UsersPage from "./pages/UsersPage";
import StatisticsPage from "./pages/StatisticsPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import Category1Page from "./pages/Category1Page";
import Category2Page from "./pages/Category2Page";
import Category3Page from "./pages/Category3Page";
import LoginAdmin from "./pages/LoginPage";
import PromotionsPage from "./pages/PromotionsPage";
import PromotionalProductPage from "./pages/PromotionalProductPage";
import ContactsPage from "./pages/ContactsPage";
import ReceiptsPage from "./pages/ReceiptsPage";

import { useSelector } from "react-redux";
import { OrderProvider } from "./contexts/OrderContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { SuppliersProvider } from "./contexts/SuppliersContext";
import { ReceiptProvider } from "./contexts/ReceiptContext";
import { PromotionsProvider } from "./contexts/PromotionsContext";

function App() {
  const isAdmin = useSelector((state) => state.auth.login?.currentAdmin?.admin);

  return (
    <Routes>
      {!isAdmin ? (
        <>
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="*" element={<Navigate to="/login" />} />{" "}
        </>
      ) : (
        <Route
          path="*"
          element={
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
              </div>

              <Sidebar />
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route
                  path="/products/category1"
                  element={
                    <CategoryProvider>
                      <Category1Page />
                    </CategoryProvider>
                  }
                />
                <Route
                  path="/products/category2"
                  element={
                    <CategoryProvider>
                      <Category2Page />
                    </CategoryProvider>
                  }
                />
                <Route
                  path="/products/category3"
                  element={
                    <CategoryProvider>
                      <Category3Page />
                    </CategoryProvider>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProductProvider>
                      <ProductsPage />
                    </ProductProvider>
                  }
                />
                <Route
                  path="/suppliers"
                  element={
                    <SuppliersProvider>
                      <SuppliersPage />
                    </SuppliersProvider>
                  }
                />
                <Route
                  path="/receipts"
                  element={
                    <ReceiptProvider>
                      <ReceiptsPage />
                    </ReceiptProvider>
                  }
                />
                <Route
                  path="/promotion/program"
                  element={
                    <PromotionsProvider>
                      <PromotionsPage />
                    </PromotionsProvider>
                  }
                />
                <Route
                  path="/promotion/product"
                  element={
                    <PromotionsProvider>
                      <PromotionalProductPage />
                    </PromotionsProvider>
                  }
                />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route
                  path="/orders"
                  element={
                    <OrderProvider>
                      <OrdersPage />
                    </OrderProvider>
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" />} />{" "}
              </Routes>
            </div>
          }
        />
      )}
    </Routes>
  );
}

export default App;
