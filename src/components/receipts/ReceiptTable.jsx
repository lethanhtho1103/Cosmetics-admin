import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import ReceiptContext from "../../contexts/ReceiptContext";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import receiptService from "../../services/receiptService";
import ReceiptDetailTable from "./ReceiptDetailTable";

const ReceiptTable = () => {
  const { receipts } = useContext(ReceiptContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReceipts, setFilteredReceipts] = useState(receipts);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    setFilteredReceipts(receipts);
  }, [receipts]);

  const columns = [
    { key: "index", label: "Mã phiếu nhập", sortable: false },
    { key: "supplier_name", label: "Tên nhà cung cấp", sortable: true },
    { key: "total_price", label: "Tổng giá trị", sortable: true },
    { key: "createdAt", label: "Ngày nhập", sortable: true },
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredReceipts(
      term === ""
        ? receipts
        : receipts.filter(
            (receipt) =>
              receipt.supplier_id.name.toLowerCase().includes(term) ||
              receipt._id.toLowerCase().includes(term) || // Tìm theo _id
              new Date(receipt.createdAt).toLocaleDateString().includes(term) // Tìm theo ngày nhập
          )
    );
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    setFilteredReceipts((prev) => {
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

  const currentReceipts = filteredReceipts?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleGetReceipt = async (id) => {
    try {
      const res = await receiptService.getReceiptById(id);
      setSelectedReceipt(res);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

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
            Danh sách phiếu nhập
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm phiếu nhập"
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
              {currentReceipts?.map((receipt) => (
                <tr
                  key={receipt._id}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleGetReceipt(receipt._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {receipt._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {receipt.supplier_id.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 ">
                    <span
                      className={
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      }
                    >
                      {receipt.total_price.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredReceipts?.length || 0}
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

      {selectedReceipt && (
        <ReceiptDetailTable
          receiptDetails={selectedReceipt.details}
          receiptId={selectedReceipt._id}
        />
      )}
    </>
  );
};

export default ReceiptTable;
