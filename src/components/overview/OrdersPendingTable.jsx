import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, X } from "lucide-react";
import TableHeader from "../common/TableHeader";
import TablePagination from "@mui/material/TablePagination";
import { toast } from "react-toastify";
import orderService from "../../services/orderService";
import { Tooltip } from "@mui/material";

const OrdersPendingTable = ({ orders, handleGetAllOrders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleAcceptOrder = async (orderId) => {
    const selectedStatus = "shipped";
    await orderService.updateStatus(orderId, selectedStatus);
    toast.success("Xác nhận đơn hàng thành công.");
    handleGetAllOrders();
  };

  const handleDeniedOrder = async (orderId) => {
    const selectedStatus = "denied";
    await orderService.updateStatus(orderId, selectedStatus);
    toast.success("Đã từ chối đơn hàng.");
    handleGetAllOrders();
  };

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "username", label: "Tên", sortable: true },
    { key: "totalPrice", label: "Tổng tiền", sortable: true },
    { key: "shipping_method", label: "Vận chuyển", sortable: true },
    { key: "orderDate", label: "Ngày đặt", sortable: true },
    { key: "status", label: "Trạng thái", sortable: true },
    { key: "is_payment", label: "Thanh toán", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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

      const shippingMethod =
        order?.shipping_method === "express" ? "nhanh" : "tiêu chuẩn";

      const paymentStatus =
        order.is_payment === "yes" ? "đã thanh toán" : "chưa thanh toán";

      const totalPrice = order.total_price.toString().toLowerCase();
      const orderDate = formatDate(order?.order_date).toLowerCase();

      return (
        username.includes(term) ||
        orderStatus.includes(term) ||
        shippingMethod.includes(term) ||
        paymentStatus.includes(term) ||
        totalPrice.includes(term) ||
        orderDate.includes(term)
      );
    });
    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (key === "username") {
        const nameA = a.user_id.username.toLowerCase();
        const nameB = b.user_id.username.toLowerCase();
        return direction === "ascending"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (key === "totalPrice") {
        const totalA = a.total_price;
        const totalB = b.total_price;
        return direction === "ascending" ? totalA - totalB : totalB - totalA;
      } else if (key === "status") {
        return direction === "ascending"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (key === "shipping_method") {
        const methodA =
          a.shipping_method === "express" ? "nhanh" : "tiêu chuẩn";
        const methodB =
          b.shipping_method === "express" ? "nhanh" : "tiêu chuẩn";
        return direction === "ascending"
          ? methodA.localeCompare(methodB)
          : methodB.localeCompare(methodA);
      } else if (key === "is_payment") {
        const paymentA =
          a.is_payment === "yes" ? "đã thanh toán" : "chưa thanh toán";
        const paymentB =
          b.is_payment === "yes" ? "đã thanh toán" : "chưa thanh toán";
        return direction === "ascending"
          ? paymentA.localeCompare(paymentB)
          : paymentB.localeCompare(paymentA);
      } else if (key === "orderDate") {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        return direction === "ascending" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredOrders(sortedOrders);
  };

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Danh Sách Đơn Hàng Cần Phê Duyệt
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
          <tbody className="divide divide-gray-700">
            {filteredOrders
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {index + 1 + page * rowsPerPage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {order?.user_id?.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {formatNumber(order.total_price)}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {order?.shipping_method === "express"
                      ? "Nhanh"
                      : "Tiêu chuẩn"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    {formatDate(order.order_date)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {order.is_payment === "yes"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex align-center">
                    <Tooltip title="Xác nhận đơn hàng" arrow>
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        className="text-green-400 hover:text-green-600 mr-2"
                      >
                        <Check size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Từ chối đơn hàng" arrow>
                      <button
                        onClick={() => handleDeniedOrder(order._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
        labelRowsPerPage="Hiển thị"
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: "white",
          "& .MuiTablePagination-actions": {
            color: "white",
          },
          "& .MuiTablePagination-selectLabel": {
            color: "white",
          },
          "& .MuiTablePagination-input": {
            color: "white",
          },
          "& .MuiTablePagination-selectIcon": {
            color: "white",
          },
        }}
      />
    </motion.div>
  );
};

export default OrdersPendingTable;
