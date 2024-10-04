import { motion } from "framer-motion";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CategoryContext from "../../contexts/CategoryContext";
import AddCategoryModal from "./AddCategoryModal";
import categoryService from "../../services/categoryService";
import Select from "react-select";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TableRow from "../common/TableRow";
import TablePagination from "@mui/material/TablePagination";

const TableCategory2 = () => {
  const {
    categories1,
    categories2,
    handleGetAllCategories2,
    handleShowEditCategory2,
  } = useContext(CategoryContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory1, setSelectedCategory1] = useState("");

  const handleCategoryChange = useCallback((selectedOption) => {
    const selected = selectedOption.value;
    setSelectedCategory1(selected);
    handleGetAllCategories2(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredCategories(categories2);
  }, [categories2]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

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

  const handleSearch = useCallback(
    (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      if (term === "") {
        setFilteredCategories(categories2);
      } else {
        const filtered = categories2.filter((category) =>
          category.name.toLowerCase().includes(term)
        );
        setFilteredCategories(filtered);
      }
    },
    [categories2]
  );

  const handleSort = useCallback(
    (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });

      const sortedCategories = [...filteredCategories].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
      setFilteredCategories(sortedCategories);
    },
    [sortConfig, filteredCategories]
  );

  const handleDelete = async (categoryId) => {
    try {
      const res = await categoryService.deleteCategory2(categoryId);
      toast.success(res.message);
      handleGetAllCategories2(selectedCategory1);
      if (currentPage > 1 && currentCategories.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const openDeleteModal = useCallback((category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (categoryToDelete) {
      handleDelete(categoryToDelete._id);
      closeDeleteModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToDelete, closeDeleteModal]);

  useEffect(() => {
    if (categories1 && categories1.length > 0) {
      const initialCategory = categories1[0]?._id;
      setSelectedCategory1(initialCategory);
      handleGetAllCategories2(initialCategory);
    }
  }, [categories1, handleGetAllCategories2]);

  const selectOptions = useMemo(
    () =>
      categories1?.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    [categories1]
  );

  return (
    <>
      <AddCategoryModal selectedCategory1={selectedCategory1} />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Danh sách danh mục cấp 2
          </h2>
          <div className="relative mr-4 w-60">
            <Select
              className="text-gray-700"
              options={selectOptions}
              value={selectOptions?.find(
                (option) => option.value === selectedCategory1
              )}
              onChange={handleCategoryChange}
              placeholder="Chọn danh mục..."
              isSearchable
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#2d3748",
                  color: "white",
                  textTransform: "capitalize",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#2d3748",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#4a5568" : "#2d3748",
                  color: "white",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4a5568",
                  },
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#a0aec0",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",
                }),
              }}
            />
          </div>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm danh mục..."
          />
        </div>

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
                onEdit={handleShowEditCategory2}
                onDelete={openDeleteModal}
              />
            ))}
          </tbody>
        </table>

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
      </motion.div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default TableCategory2;
