import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import SuppliersContext from "../../contexts/SuppliersContext";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import AddSupplierModal from "./AddSupplierModal";
import suppliersService from "../../services/suppliersService";

const SupplierTable = () => {
  const { handleShowEditSupplier, suppliers, handleGetAllSuppliers } =
    useContext(SuppliersContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên nhà cung cấp", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Địa chỉ", sortable: true },
    { key: "phone", label: "Số điện thoại", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSuppliers(
      term === ""
        ? suppliers
        : suppliers.filter((supplier) =>
            supplier.name.toLowerCase().includes(term)
          )
    );
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    setFilteredSuppliers((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    });
  };

  const handleDelete = async (supplierId) => {
    try {
      const res = await suppliersService.deleteSupplierById(supplierId);
      toast.success(res.message);
      handleGetAllSuppliers();
      if (currentPage > 0 && filteredSuppliers.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const openDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSupplierToDelete(null);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      handleDelete(supplierToDelete._id);
      closeDeleteModal();
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const currentSuppliers = filteredSuppliers?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <AddSupplierModal />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100 capitalize">
            Danh sách nhà cung cấp
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm nhà cung cấp"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              handleSort={handleSort}
            />
            <tbody className="divide-y divide-gray-700">
              {currentSuppliers?.map((supplier, index) => (
                <tr key={supplier._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {currentPage * rowsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {supplier.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {supplier.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {supplier.phone}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleShowEditSupplier(supplier._id)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openDeleteModal(supplier)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredSuppliers?.length || 0}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hiển thị"
          rowsPerPageOptions={[5, 10, 15, 20]}
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
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      </motion.div>
    </>
  );
};

export default SupplierTable;
