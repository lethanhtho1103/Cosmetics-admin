import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CategoryContext from "../../contexts/CategoryContext";
import AddCategoryModal from "./AddCategoryModal";
import categoryService from "../../services/categoryService";

const TableCategory = () => {
  const { handleShowEditCategory1, categories1, handleGetAllCategories1 } =
    useContext(CategoryContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    setFilteredCategories(categories1);
  }, [categories1]);

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories?.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredCategories(categories1);
    } else {
      const filtered = categories1.filter((category) => {
        return category.name.toLowerCase().includes(term);
      });
      setFilteredCategories(filtered);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedCategories = [...filteredCategories].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setFilteredCategories(sortedCategories);
  };

  const handleDelete = async (categoryId) => {
    try {
      const res = await categoryService.deleteCategory1(categoryId);
      toast.success(res.message);
      handleGetAllCategories1();
      if (currentPage > 1 && currentCategories.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
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
            Danh mục sản phẩm
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  STT
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Tên
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="inline ml-2 text-blue-400" />
                    ) : (
                      <ChevronDown className="inline ml-2 text-blue-400" />
                    ))}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentCategories?.map((category, index) => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleShowEditCategory1(category._id)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Hiển thị</span>
            <select
              className="bg-gray-700 text-white py-2 px-4 rounded"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}/{filteredCategories?.length}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center items-center">
            <button
              className={`bg-gray-600 text-white py-2 px-4 rounded mr-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span className="text-gray-400">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className={`bg-gray-600 text-white py-2 px-4 rounded ml-2 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          productName={categoryToDelete?.name}
        />
      </motion.div>
    </>
  );
};

export default TableCategory;
