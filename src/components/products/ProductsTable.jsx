import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import productService from "../../services/productService";
import { baseUrl } from "../../axios";
import { ChevronUp, ChevronDown } from "lucide-react";

const ProductsTable = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    categories && categories.length > 0 ? categories[0]?.name : ""
  );
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
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
  };

  // Function to sort products
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    if (sortConfig.key) {
      sortedProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      setFilteredProducts(sortedProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortConfig]);

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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
  };

  useEffect(() => {
    if (selectedCategory) {
      handleGetAllProducts(selectedCategory);
    }
  }, [selectedCategory]);

  return (
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

        <div className="relative mr-4">
          <select
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-3 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                        <ChevronUp className="inline ml-2" />
                      ) : (
                        <ChevronDown className="inline ml-2" />
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
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
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
                {num}
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
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
    </motion.div>
  );
};

export default ProductsTable;
