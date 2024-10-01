import { motion } from "framer-motion";
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

const dailyOrdersData = [
  { date: "07/01", orders: 45 },
  { date: "07/02", orders: 52 },
  { date: "07/03", orders: 49 },
  { date: "07/04", orders: 60 },
  { date: "07/05", orders: 55 },
  { date: "07/06", orders: 58 },
  { date: "07/07", orders: 50 },
  { date: "07/08", orders: 62 },
  { date: "07/09", orders: 70 },
  { date: "07/10", orders: 68 },
  { date: "07/11", orders: 73 },
  { date: "07/12", orders: 75 },
  { date: "07/13", orders: 80 },
  { date: "07/14", orders: 78 },
  { date: "07/15", orders: 82 },
  { date: "07/16", orders: 85 },
  { date: "07/17", orders: 90 },
  { date: "07/18", orders: 92 },
  { date: "07/19", orders: 88 },
  { date: "07/20", orders: 94 },
  { date: "07/21", orders: 91 },
  { date: "07/22", orders: 87 },
  { date: "07/23", orders: 95 },
  { date: "07/24", orders: 97 },
  { date: "07/25", orders: 100 },
  { date: "07/26", orders: 102 },
  { date: "07/27", orders: 105 },
  { date: "07/28", orders: 108 },
  { date: "07/29", orders: 110 },
  { date: "07/30", orders: 115 },
];

const DailyOrders = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Daily Orders</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyOrdersData}>
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
