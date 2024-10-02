import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo, useContext } from "react";
import productService from "../../services/productService";
import { baseUrl } from "../../axios";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import ProductContext from "../../contexts/ProductContext";
import AddProductModal from "./AddProductModal";
import Pagination from "../common/Pagination";
import Select from "react-select";

const ProductsTable = () => {
  const { handleShowEditProduct, categories } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Function to sort products
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => {
        return (
          (product.name?.toLowerCase() || "").includes(term) ||
          (product.category?.toLowerCase() || "").includes(term) ||
          (product.price?.toString() || "").toLowerCase().includes(term) ||
          (product.quantity?.toString() || "").toLowerCase().includes(term) ||
          (product.trademark?.toLowerCase() || "").includes(term) ||
          (product.origin?.toLowerCase() || "").includes(term) ||
          (product.sold_quantity?.toString() || "").toLowerCase().includes(term)
        );
      });
      setFilteredProducts(filtered);
    }
  };

  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;

    const sorted = [...filteredProducts];
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
  }, [filteredProducts, sortConfig]);

  useEffect(() => {
    setFilteredProducts(sortedProducts);
  }, [sortedProducts]);

  const handleGetAllProducts = async (categoryName) => {
    if (categoryName) {
      try {
        const res = await productService.getAllProductByCategoryName({
          categoryName,
        });
        setProducts(res?.data || []);
        setFilteredProducts(res?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  const handleCategoryChange = (selectedOption) => {
    const selected = selectedOption?.value;
    setSelectedCategory(selected);
    handleGetAllProducts(selected);
  };

  const handleDelete = async (productId) => {
    try {
      const res = await productService.deleteProduct(productId);
      toast.success(res.message);
      handleGetAllProducts(selectedCategory);

      if (currentPage > 1 && currentProducts.length === 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete._id);
      closeDeleteModal();
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      const initialCategory = categories[0]?.name;
      setSelectedCategory(initialCategory);
      handleGetAllProducts(initialCategory);
    }
  }, [categories]);

  const selectOptions = useMemo(
    () =>
      categories?.map((category) => ({
        value: category.name,
        label: category.name,
      })),
    [categories]
  );

  return (
    <>
      <AddProductModal
        handleGetAllProducts={handleGetAllProducts}
        selectedCategory={selectedCategory}
      />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Danh sách sản phẩm
          </h2>
          <div className="relative mr-4 w-60">
            <Select
              className="text-gray-700"
              options={selectOptions}
              value={selectOptions?.find(
                (option) => option.value === selectedCategory
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
                {[
                  { label: "Tên", key: "name" },
                  { label: "Giá", key: "price" },
                  { label: "Số lượng", key: "quantity" },
                  { label: "Thương hiệu", key: "trademark" },
                  { label: "Xuất xứ", key: "origin" },
                  { label: "Đã bán", key: "sold_quantity" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <>
                        {sortConfig.direction === "ascending" ? (
                          <ChevronUp className="inline ml-2 text-blue-400" />
                        ) : (
                          <ChevronDown className="inline ml-2 text-blue-400" />
                        )}
                      </>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {currentProducts.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={`${baseUrl}/${product?.image}`}
                      alt="Product img"
                      className="size-10 rounded-full"
                    />
                    {product?.name.length > 20
                      ? product?.name.substring(0, 20) + "..."
                      : product?.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product?.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product?.quantity}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product?.trademark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product?.origin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.sold_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Edit
                        size={18}
                        onClick={() => handleShowEditProduct(product?.name)}
                      />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          filteredCategoriesLength={filteredProducts?.length}
        />
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          productName={productToDelete?.name}
        />
      </motion.div>
    </>
  );
};

export default ProductsTable;
