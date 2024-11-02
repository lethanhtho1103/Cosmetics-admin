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
import statisticsService from "../../services/statisticsService";

const YearlySales = () => {
  const [ordersStatistics, setOrdersStatistics] = useState([]);
  const [totalYearlyRevenue, setTotalYearlyRevenue] = useState(0);

  const [year, setYear] = useState(new Date().getFullYear());

  const handleGetOrderStatistics = async () => {
    try {
      const res = await statisticsService.getOrderStatisticsByYear({
        year,
      });
      setTotalYearlyRevenue(res.totalYearlyRevenue);
      const formattedData = res.data.map((item) => {
        const key = "Doanh_thu";
        return {
          date: `${item.month}`,
          [key]: item.totalRevenue,
        };
      });
      setOrdersStatistics(formattedData);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };

  useEffect(() => {
    handleGetOrderStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-100">
          {`Doanh Thu Năm ${year}: `}
          <span className="text-red-500">
            {totalYearlyRevenue.toLocaleString()}đ
          </span>
        </h2>

        <div>
          <label className="text-gray-200">Năm:</label>
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
              dataKey="Doanh_thu"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default YearlySales;
