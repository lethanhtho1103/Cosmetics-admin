import { Package, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import DailyOrders from "../components/orders/DailyOrders";
import { useEffect, useState } from "react";
import statisticsService from "../services/statisticsService";

const OverviewPage = () => {
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  const [categoriesTopSales, setCategoriesTopSales] = useState([]);

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const handleGetStatistics = async () => {
    return statisticsService.getStatistics();
  };

  const handleGetCategoriesTopSales = async () => {
    return statisticsService.getCategoriesTopSales();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statisticsRes, categoriesTopSalesRes] = await Promise.all([
          handleGetStatistics(),
          handleGetCategoriesTopSales(),
        ]);

        setStatistics(statisticsRes.data);
        setCategoriesTopSales(categoriesTopSalesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Tổng Quan" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng Doanh Thu"
            icon={Zap}
            value={formatNumberWithCommas(statistics?.totalRevenue)}
            color="#6366F1"
          />
          <StatCard
            name="Tổng Người Dùng"
            icon={Users}
            value={statistics?.totalUsers}
            color="#8B5CF6"
          />
          <StatCard
            name="Tổng Sản Phẩm"
            icon={ShoppingBag}
            value={statistics?.totalProducts}
            color="#EC4899"
          />
          <StatCard
            name="Tổng Đơn Hàng"
            icon={Package}
            value={statistics.totalOrders}
            color="#F59E0B"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <DailyOrders
            isOverview={true}
            formatNumberWithCommas={formatNumberWithCommas}
          />
        </div>
        <div className="grid  mt-8 grid-cols-1 lg:grid-cols-1 gap-8">
          <CategoryDistributionChart categoriesTopSales={categoriesTopSales} />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
