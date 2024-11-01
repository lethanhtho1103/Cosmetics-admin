import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import { useEffect, useState } from "react";
import statisticsService from "../services/statisticsService";
import ProductsTopSalesTable from "../components/sales/ProductsTopSalesTable";

const salesStats = {
  totalRevenue: "$1,234,567",
  averageOrderValue: "$78.90",
  conversionRate: "3.45%",
  salesGrowth: "12.3%",
};

const SalesPage = () => {
  const [productsTopSales, setProductsTopSales] = useState([]);
  const handleGetProductsTopSales = async () => {
    const res = await statisticsService.getProductsTopSales();
    setProductsTopSales(res.data);
  };

  useEffect(() => {
    handleGetProductsTopSales();
  }, []);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Bảng Điều Khiển Bán Hàng" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng Doanh Thu"
            icon={DollarSign}
            value={salesStats.totalRevenue}
            color="#6366F1"
          />
          <StatCard
            name="Giá Trị Đơn Trung Bình"
            icon={ShoppingCart}
            value={salesStats.averageOrderValue}
            color="#10B981"
          />
          <StatCard
            name="Tỉ Lệ Chuyển Đổi"
            icon={TrendingUp}
            value={salesStats.conversionRate}
            color="#F59E0B"
          />
          <StatCard
            name="Tăng Trưởng Doanh Thu"
            icon={CreditCard}
            value={salesStats.salesGrowth}
            color="#EF4444"
          />
        </motion.div>

        <SalesOverviewChart />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <ProductsTopSalesTable productsTopSales={productsTopSales} />
        </div>
      </main>
    </div>
  );
};
export default SalesPage;
