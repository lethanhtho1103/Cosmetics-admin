import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TableRow from "../common/TableRow";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CategoryContext from "../../contexts/CategoryContext";
import AddCategoryModal from "./AddCategoryModal";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";

const TableCategory = () => {
  const { handleShowEditCategory1, categories1, handleGetAllCategories1 } =
    useContext(CategoryContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    setFilteredCategories(categories1);
  }, [categories1]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCategories(
      term === ""
        ? categories1
        : categories1.filter((category) =>
            category.name.toLowerCase().includes(term)
          )
    );
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    setFilteredCategories((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    });
  };

  const handleDelete = async (categoryId) => {
    try {
      const res = await categoryService.deleteCategory1(categoryId);
      toast.success(res.message);
      handleGetAllCategories1();
      if (currentPage > 0 && filteredCategories.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      handleDelete(categoryToDelete._id);
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

  const currentCategories = filteredCategories?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <AddCategoryModal />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Danh sách danh mục cấp 1
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm danh mục..."
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
              {currentCategories?.map((category, index) => (
                <TableRow
                  key={category._id}
                  category={category}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={rowsPerPage}
                  onEdit={handleShowEditCategory1}
                  onDelete={openDeleteModal}
                />
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredCategories?.length || 0}
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

export default TableCategory;
