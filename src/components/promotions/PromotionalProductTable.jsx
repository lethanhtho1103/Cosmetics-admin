import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import TableHeader from "../common/TableHeader";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "react-toastify";
import TablePagination from "@mui/material/TablePagination";
import PromotionsContext from "../../contexts/PromotionsContext";
import { Edit, Trash2 } from "lucide-react";
import promotionsService from "../../services/promotionsService";
import AddPromotionalProductModal from "./AddPromotionalProductModal";
import { Tooltip } from "@mui/material";

const PromotionalProductTable = () => {
  const {
    promotionalProducts,
    handleGetAllPromotion,
    handleShowEditPromotionalProduct,
  } = useContext(PromotionsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] =
    useState(promotionalProducts);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  useEffect(() => {
    setFilteredCategories(promotionalProducts);
  }, [promotionalProducts]);

  const columns = [
    { key: "index", label: "STT", sortable: false },
    { key: "name", label: "Tên Sản Phẩm", sortable: true },
    { key: "discount_type", label: "Tên khuyễn mãi", sortable: true },
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
        ? promotionalProducts
        : promotionalProducts.filter((promotion) =>
            promotion?.product_id.name.toLowerCase().includes(term)
          )
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedPromotions = [...filteredCategories].sort((a, b) => {
      if (key === "name") {
        const nameA = a.product_id.name.toLowerCase();
        const nameB = b.product_id.name.toLowerCase();
        return direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (key === "discount_type") {
        const discountA = a.promotion_id.name.toLowerCase();
        const discountB = b.promotion_id.name.toLowerCase();
        return direction === "asc"
          ? discountA.localeCompare(discountB)
          : discountB.localeCompare(discountA);
      } else if (key === "status") {
        return direction === "asc"
          ? a.promotion_id.status.localeCompare(b.promotion_id.status)
          : b.promotion_id.status.localeCompare(a.promotion_id.status);
      }
      return 0;
    });

    setFilteredCategories(sortedPromotions);
  };

  const handleDelete = async (promotionId) => {
    try {
      const res = await promotionsService.deletePromotionalProduct(promotionId);
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
      <AddPromotionalProductModal />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100 capitalize">
            Danh sách sản phẩm khuyễn mãi
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Tìm kiếm"
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
                    {promotion?.product_id.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    {promotion?.promotion_id.name}
                  </td>

                  <td className="px-6 py-4 capitalize text-sm text-gray-300">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion?.promotion_id.status === "active"
                          ? "bg-green-100 text-green-800"
                          : promotion?.promotion_id.status === "inactive"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {translateStatus(promotion?.promotion_id.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex text-sm text-gray-300">
                    <Tooltip title="Chỉnh sửa" arrow>
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() =>
                          handleShowEditPromotionalProduct(promotion?._id)
                        }
                      >
                        <Edit size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Xóa" arrow>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => openDeleteModal(promotion)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
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

export default PromotionalProductTable;
