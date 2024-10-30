import { motion } from "framer-motion";
import ReactDOM from "react-dom";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4 sm:mx-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Xác nhận xóa
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa <strong>{productName}</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default ConfirmDeleteModal;
