import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import PromotionsContext from "../../contexts/PromotionsContext";
import { Edit, Trash2 } from "lucide-react";
import AddPromotionModal from "./AddPromotionModal";
import promotionsService from "../../services/promotionsService";

const PromotionTable = () => {
  const { promotions, handleGetAllPromotion, handleShowEditPromotion } =
    useContext(PromotionsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(promotions);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  useEffect(() => {
    setFilteredCategories(promotions);
  }, [promotions]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên", sortable: true },
    { key: "discount_type", label: "Loại Khuyến Mãi", sortable: true },
    { key: "discount_value", label: "Giá Khuyến Mãi", sortable: true },
    { key: "start_date", label: "Ngày Bắt Đầu", sortable: true },
    { key: "end_date", label: "Ngày Kết Thúc", sortable: true },
    { key: "status", label: "Trạng Thái", sortable: true },
    { key: "actions", label: "Hành Động", sortable: false },
  ];

  const translateStatus = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "inactive":
        return "Chưa hoạt động";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCategories(
      term === ""
        ? promotions
        : promotions.filter((promotion) =>
            promotion.name.toLowerCase().includes(term)
          )
    );
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    setFilteredCategories((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    });
  };

  const handleDelete = async (promotionId) => {
    try {
      const res = await promotionsService.deletePromotion(promotionId);
      toast.success(res.message);
      handleGetAllPromotion();
      if (currentPage > 0 && filteredCategories.length === 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const openDeleteModal = (promotion) => {
    setPromotionToDelete(promotion);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setPromotionToDelete(null);
  };

  const confirmDelete = () => {
    if (promotionToDelete) {
      handleDelete(promotionToDelete._id);
      closeDeleteModal();
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const currentPromotions = filteredCategories?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <AddPromotionModal />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Danh sách khuyến mãi
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm khuyến mãi..."
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
              {currentPromotions?.map((promotion, index) => (
                <tr key={promotion._id}>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {index + 1 + currentPage * rowsPerPage}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {promotion.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {promotion.discount_type === "buy_one_get_one"
                      ? "Mua 1 tặng 1"
                      : promotion.discount_type === "percent"
                      ? "Phần Trăm"
                      : promotion.discount_type}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {promotion?.discount_value === "percent"
                      ? "Mua 1 tặng 1"
                      : promotion?.discount_value}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {new Date(promotion.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {new Date(promotion.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {translateStatus(promotion.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleShowEditPromotion(promotion?._id)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteModal(promotion)}
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
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      </motion.div>
    </>
  );
};

export default PromotionTable;
