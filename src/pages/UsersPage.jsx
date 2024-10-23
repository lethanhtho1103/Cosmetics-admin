import { UserPlus, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import { useEffect, useState } from "react";
import authService from "../services/authService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
  });

  const handleGetAllUsers = async () => {
    const res = await authService.getAllUsers();
    setUsers(res?.data);
  };

  const calculateUserStats = (users) => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const startOfTomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).getTime();

    const totalUsers = users.length;
    const newUsersToday = users.filter((user) => {
      const createdAt = new Date(user?.createdAt).getTime();
      console.log(user?.createdAt);
      return createdAt >= startOfToday && createdAt < startOfTomorrow;
    }).length;

    setUserStats((prevStats) => ({
      ...prevStats,
      totalUsers,
      newUsersToday,
    }));
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      calculateUserStats(users);
    }
  }, [users]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Người Dùng" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
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
        </motion.div>

        <UsersTable users={users} />
      </main>
    </div>
  );
};

export default UsersPage;
