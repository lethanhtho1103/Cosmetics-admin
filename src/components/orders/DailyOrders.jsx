import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import orderService from "../../services/orderService";

const DailyOrders = () => {
  const [ordersStatistics, setOrdersStatistics] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Tháng bắt đầu từ 0 nên +1

  const handleGetOrderStatistics = async () => {
    try {
      const res = await orderService.getOrderStatisticsByMonth({ year, month });
      const formattedData = res.data.map((item) => ({
        date: `${item.day}`,
        orders: item.count,
      }));
      setOrdersStatistics(formattedData);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };

  useEffect(() => {
    handleGetOrderStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-100 ">
          Thống kê đơn hàng
        </h2>

        <div>
          <label className="text-gray-200">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="ml-2 p-2 bg-gray-700 text-white rounded"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>

          <label className="text-gray-200 ml-4">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="ml-2 p-2 bg-gray-700 text-white rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={ordersStatistics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
