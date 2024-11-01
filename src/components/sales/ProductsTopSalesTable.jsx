import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { baseUrl } from "../../axios";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TablePagination from "@mui/material/TablePagination";

const ProductsTopSalesTable = ({ productsTopSales }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      setFilteredProducts(productsTopSales);
    } else {
      const filtered = productsTopSales.filter((product) => {
        return (product.name?.toLowerCase() || "").includes(term);
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
    setFilteredProducts(productsTopSales);
  }, [productsTopSales]);

  useEffect(() => {
    setFilteredProducts(sortedProducts);
  }, [sortedProducts]);

  const columns = [
    { label: "Tên", key: "name", sortable: true },
    { label: "Giá", key: "price", sortable: true },
    { label: "Đã bán", key: "sold_quantity", sortable: true },
    { label: "Thành tiền", key: "totalPrice", sortable: true },
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
          <h2 className="text-xl font-semibold text-gray-100 capitalize">
            Danh sách sản phẩm bán chạy
          </h2>
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
                      ? product?.name.substring(0, 50) + "..."
                      : product?.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.price.toLocaleString()}đ
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.sold_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {(product.sold_quantity * product.price).toLocaleString()}
                      đ
                    </span>
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
      </motion.div>
    </>
  );
};

export default ProductsTopSalesTable;
