import { CheckCircle, Clock, ShoppingBag, Truck, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { useContext } from "react";
import OrderContext from "../contexts/OrderContext";

const OrdersPage = () => {
  const { orders } = useContext(OrderContext);

  const countOrderStatuses = (orders) => {
    const statusCounts = {
      totalOrders: orders.length,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      deniedOrders: 0,
    };

    orders.forEach((order) => {
      if (order.status === "pending") {
        statusCounts.pendingOrders += 1;
      } else if (order.status === "shipped") {
        statusCounts.shippedOrders += 1;
      } else if (order.status === "delivered") {
        statusCounts.deliveredOrders += 1;
      } else if (order.status === "denied") {
        statusCounts.deniedOrders += 1;
      }

      // Tính tổng doanh thu từ các đơn hàng
      statusCounts.totalRevenue += order.total_price || 0;
    });

    return statusCounts;
  };

  const orderStats = countOrderStatuses(orders);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Đơn Hàng"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng Đơn Hàng"
            icon={ShoppingBag} // Icon phù hợp với tổng đơn hàng
            value={orderStats.totalOrders}
            color="#6366F1"
          />
          <StatCard
            name="Đơn Chờ Xử Lý"
            icon={Clock}
            value={orderStats.pendingOrders}
            color="#F59E0B"
          />
          <StatCard
            name="Đang Vận Chuyển"
            icon={Truck}
            value={orderStats.shippedOrders}
            color="#3B82F6"
          />
          <StatCard
            name="Đơn Hoàn Thành"
            icon={CheckCircle}
            value={orderStats.deliveredOrders}
            color="#10B981"
          />
          <StatCard
            name="Đơn Hủy"
            icon={XCircle}
            value={orderStats.deniedOrders}
            color="#EF4444"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
