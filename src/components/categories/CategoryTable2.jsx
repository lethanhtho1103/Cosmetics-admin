import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CategoryContext from "../../contexts/CategoryContext";
import AddCategoryModal from "./AddCategoryModal";
import Pagination from "../common/Pagination";
import categoryService from "../../services/categoryService";
import Select from "react-select";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  const currentCategories = useMemo(() => {
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    return filteredCategories?.slice(indexOfFirstCategory, indexOfLastCategory);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategories?.length / itemsPerPage);
  }, [filteredCategories?.length, itemsPerPage]);

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
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Tên danh mục{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
              <th className="py-3 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentCategories.map((category) => (
              <tr key={category._id}>
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4 flex">
                  <button
                    onClick={() => handleShowEditCategory2(category)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="ml-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          filteredCategoriesLength={filteredCategories?.length}
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