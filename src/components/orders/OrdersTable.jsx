import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, ChevronUp, ChevronDown } from "lucide-react";
import OrderContext from "../../contexts/OrderContext";
import ViewOrder from "./ViewOrder";

const OrdersTable = () => {
  const { orders } = useContext(OrderContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleShowViewOrder = (id) => {
    setOrderId(id);
  };

  const handleCancelViewOrder = () => {
    setOrderId("");
  };

  const handleTotalPriceOrder = (order) => {
    const result = order?.reduce((total, currentItem) => {
      return total + currentItem?.unit_price * currentItem?.quantity;
    }, 0);
    return result;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter((order) => {
      const username = order?.user_id?.username
        ? order.user_id.username.toLowerCase()
        : "";
      const orderStatus =
        order.status === "delivered"
          ? "đã giao"
          : order.status === "pending"
          ? "đang chờ xử lý"
          : order.status === "shipped"
          ? "đang vận chuyển"
          : "đã hủy";

      const totalPrice = handleTotalPriceOrder(order?.orderDetails)
        .toString()
        .toLowerCase();
      const orderDate = formatDate(order?.order_date).toLowerCase();
      return (
        username.includes(term) ||
        orderStatus.includes(term) ||
        totalPrice.includes(term) ||
        orderDate.includes(term)
      );
    });
    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (key === "username") {
        const nameA = a.user_id.username.toLowerCase();
        const nameB = b.user_id.username.toLowerCase();
        return direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (key === "totalPrice") {
        const totalA = handleTotalPriceOrder(a.orderDetails);
        const totalB = handleTotalPriceOrder(b.orderDetails);
        return direction === "asc" ? totalA - totalB : totalB - totalA;
      } else if (key === "status") {
        return direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (key === "orderDate") {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredOrders(sortedOrders);
  };

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Danh Sách Đơn Hàng
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                STT
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center">
                  Tên
                  {sortConfig.key === "username" && (
                    <span className="ml-2 text-blue-400">
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("totalPrice")}
              >
                <div className="flex items-center">
                  Tổng tiền
                  {sortConfig.key === "totalPrice" && (
                    <span className="ml-2 text-blue-400">
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Trạng thái
                  {sortConfig.key === "status" && (
                    <span className="ml-2 text-blue-400">
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("orderDate")}
              >
                <div className="flex items-center">
                  Ngày đặt
                  {sortConfig.key === "orderDate" && (
                    <span className="ml-2 text-blue-400">
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {filteredOrders?.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order?.user_id?.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  ${handleTotalPriceOrder(order?.orderDetails)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "delivered"
                      ? "Đã giao"
                      : order.status === "pending"
                      ? "Đang chờ xử lý"
                      : order.status === "shipped"
                      ? "Đang vận chuyển"
                      : "Đã hủy"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {formatDate(order.order_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 text-center flex justify-center">
                  <Eye
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handleShowViewOrder(order._id)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {orderId && (
        <ViewOrder
          orderId={orderId}
          formatDate={formatDate}
          onClose={handleCancelViewOrder}
        />
      )}
    </motion.div>
  );
};

export default OrdersTable;
