import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo, useContext } from "react";
import productService from "../../services/productService";
import { baseUrl } from "../../axios";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import ProductContext from "../../contexts/ProductContext";
import Select from "react-select";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TablePagination from "@mui/material/TablePagination";
import { Tooltip } from "@mui/material";

const ProductsTable = () => {
  const { handleShowEditProduct, categories, formatNumber } =
    useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const currentProducts = filteredProducts?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

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

  const columns = [
    { label: "Tên", key: "name", sortable: true },
    { label: "Giá", key: "price", sortable: true },
    { label: "Tồn kho", key: "quantity", sortable: true },
    { label: "Thương hiệu", key: "trademark", sortable: true },
    { label: "Xuất xứ", key: "origin", sortable: true },
    { label: "Đã bán", key: "sold_quantity", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  return (
    <>
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
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm sản phẩm..."
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
                      ? product?.name.substring(0, 30) + "..."
                      : product?.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {formatNumber(product?.price)}đ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatNumber(product?.quantity)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 uppercase">
                    {product?.trademark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {product?.origin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.sold_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Tooltip title="Chỉnh sửa" arrow>
                      <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                        <Edit
                          size={18}
                          onClick={() => handleShowEditProduct(product?.name)}
                        />
                      </button>
                    </Tooltip>
                    <Tooltip title="Xóa" arrow>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredProducts?.length || 0}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
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
