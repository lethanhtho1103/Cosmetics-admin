import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import TablePagination from "@mui/material/TablePagination";
import TableHeader from "../common/TableHeader";

const UsersTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const columns = [
    { label: "Tên", key: "username", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "SĐT", key: "phone", sortable: true },
    // { label: "Ngày sinh", key: "date_of_birth", sortable: true },
    { label: "Địa chỉ", key: "address", sortable: true },
    { label: "Loại tài khoản", key: "type", sortable: true },
  ];

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users?.filter((user) => {
      return (
        user?.username?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term) ||
        user?.phone?.toLowerCase().includes(term) ||
        user?.address?.toLowerCase().includes(term) ||
        user?.type?.toLowerCase().includes(term)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    setFilteredUsers(sortedUsers);
  }, [sortedUsers]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Danh Sách Người Dùng
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
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

          <tbody className="divide-y divide-gray-700">
            {filteredUsers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((user) => (
                <motion.tr
                  key={user?._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user?.username?.toUpperCase().charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user?.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user?.phone}
                    </span>
                  </td>

                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {formatDate(user?.date_of_birth)}
                    </div>
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.ward ? (
                      <div className="text-sm text-white">
                        {user?.address}, {user?.ward}, {user?.district},{" "}
                        {user?.province}
                      </div>
                    ) : (
                      <div className="text-sm text-white">Chưa có địa chỉ</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user?.type}</div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Hiển thị"
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

export default UsersTable;
