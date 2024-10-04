import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { useEffect, useState } from "react";
import authService from "../services/authService";

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const handleGetAllUsers = async () => {
    const res = await authService.getAllUsers();
    setUsers(res?.data);
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Người Dùng" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* THỐNG KÊ NGƯỜI DÙNG */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng Người Dùng"
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="Người Dùng Mới Hôm Nay"
            icon={UserPlus}
            value={userStats.newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="Người Dùng Hoạt Động"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Tỉ Lệ Rời Bỏ"
            icon={UserX}
            value={userStats.churnRate}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable users={users} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* <UserGrowthChart />
          <UserActivityHeatmap /> */}
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};
export default UsersPage;
