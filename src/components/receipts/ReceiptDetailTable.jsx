import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import TablePagination from "@mui/material/TablePagination";
import ReceiptContext from "../../contexts/ReceiptContext";
import { Edit, Trash2 } from "lucide-react";
import UpdateReceiptDetail from "./UpdateReceiptDetail";

const ReceiptDetailTable = ({ receiptDetails, receiptId }) => {
  const { handleShowEditReceiptDetail } = useContext(ReceiptContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetails, setFilteredDetails] = useState(receiptDetails);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setFilteredDetails(receiptDetails);
  }, [receiptDetails]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "product_name", label: "Tên sản phẩm", sortable: true },
    { key: "quantity", label: "Số lượng", sortable: true },
    { key: "import_price", label: "Giá nhập", sortable: true },
    { key: "actions", label: "Hành động", sortable: false },
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredDetails(
      term === ""
        ? receiptDetails
        : receiptDetails.filter(
            (detail) =>
              detail.product_id.name.toLowerCase().includes(term) ||
              detail.quantity.toString().includes(term) ||
              detail.import_price.toString().includes(term)
          )
    );
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    setFilteredDetails((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const currentDetails = filteredDetails?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <UpdateReceiptDetail />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-100 capitalize">
            Chi tiết sản phẩm trong phiếu nhập:{" "}
            <span className="text-red-500">{receiptId}</span>
          </h3>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm sản phẩm"
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
              {currentDetails?.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.product_id.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {product.import_price.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowEditReceiptDetail(product._id);
                      }}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // openDeleteModal(receipt);
                      }}
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
          count={filteredDetails?.length || 0}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hiển thị"
          rowsPerPageOptions={[5, 10, 15, 20]}
          sx={{
            color: "white",
            "& .MuiTablePagination-actions": { color: "white" },
            "& .MuiTablePagination-selectLabel": { color: "white" },
            "& .MuiTablePagination-input": { color: "white" },
            "& .MuiTablePagination-selectIcon": { color: "white" },
          }}
        />
      </motion.div>
    </>
  );
};

export default ReceiptDetailTable;
