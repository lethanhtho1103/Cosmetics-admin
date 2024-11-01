import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";

const TableRow = ({ category, index, onEdit, onDelete }) => {
  return (
    <motion.tr
      key={category._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {index + 1}
      </td>
      <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {category.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <Tooltip title="Chỉnh sửa" arrow>
          <button
            className="text-indigo-400 hover:text-indigo-300 mr-2"
            onClick={() => onEdit(category._id)}
          >
            <Edit size={18} />
          </button>
        </Tooltip>

        <Tooltip title="Xóa" arrow>
          <button
            onClick={() => onDelete(category)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={20} />
          </button>
        </Tooltip>
      </td>
    </motion.tr>
  );
};

export default TableRow;
