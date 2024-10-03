import { motion } from "framer-motion";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CategoryContext from "../../contexts/CategoryContext";
import AddCategoryModal from "./AddCategoryModal";
import categoryService from "../../services/categoryService";
import Select from "react-select";
import Pagination from "../common/Pagination";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TableRow from "../common/TableRow";

const TableCategory3 = () => {
  const { categories3, handleGetAllCategories3, handleShowEditCategory3 } =
    useContext(CategoryContext);

  const [categories2, setCategories2] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory2, setSelectedCategory2] = useState("");

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  const handleCategoryChange = useCallback((selectedOption) => {
    const selected = selectedOption.value;
    setSelectedCategory2(selected);
    handleGetAllCategories3(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredCategories(categories3);
  }, [categories3]);

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
        setFilteredCategories(categories3);
      } else {
        const filtered = categories3.filter((category) =>
          category.name.toLowerCase().includes(term)
        );
        setFilteredCategories(filtered);
      }
    },
    [categories3]
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
      const res = await categoryService.deleteCategory3(categoryId);
      toast.success(res.message);
      handleGetAllCategories3(selectedCategory2);
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

  const handleGetAllCategories2 = async () => {
    const res = await categoryService.getCategory2();
    setCategories2(res);
  };

  useEffect(() => {
    if (categories2 && categories2.length > 0) {
      const initialCategory = categories2[0]?._id;
      setSelectedCategory2(initialCategory);
      handleGetAllCategories3(initialCategory);
    }
  }, [categories2, handleGetAllCategories3]);

  useEffect(() => {
    handleGetAllCategories2();
  }, []);

  const selectOptions = useMemo(
    () =>
      categories2?.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    [categories2]
  );

  return (
    <>
      <AddCategoryModal
        selectedCategory2={selectedCategory2}
        categories2={categories2}
      />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Danh sách danh mục cấp 3
          </h2>
          <div className="relative mr-4 w-60">
            <Select
              className="text-gray-700"
              options={selectOptions}
              value={selectOptions?.find(
                (option) => option.value === selectedCategory2
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
                  textTransform: "capitalize",

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
                  itemsPerPage={itemsPerPage}
                  onEdit={handleShowEditCategory3}
                  onDelete={openDeleteModal}
                />
              ))}
            </tbody>
          </table>
        </div>
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
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục ${categoryToDelete?.name}?`}
      />
    </>
  );
};

export default TableCategory3;
