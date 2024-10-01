import { useContext, useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";
import CategoryContext from "../../contexts/CategoryContext";

const AddCategory1Modal = () => {
  const {
    modalOpenAddCategory1,
    modalOpenEditCategory1,
    closeModal,
    category1,
    handleGetAllCategories1,
  } = useContext(CategoryContext);

  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên danh mục là bắt buộc";
    return newErrors;
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setName(value);

    if (errors.name) {
      setErrors({ ...errors, name: null });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let res;
      if (modalOpenAddCategory1) {
        res = await categoryService.createCategory1({ name });
        toast.success(res.message);
      } else if (modalOpenEditCategory1) {
        res = await categoryService.updateCategory1(category1._id, { name });
        toast.success(res.message);
      }
      handleGetAllCategories1();
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý danh mục.");
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setName("");
    setErrors({});
  };

  useEffect(() => {
    if (category1) {
      setName(category1.name || "");
    } else {
      setName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category1]);

  return (
    (modalOpenAddCategory1 || modalOpenEditCategory1) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {modalOpenEditCategory1 ? "Chỉnh Sửa Danh mục" : "Thêm Danh Mục"}
          </h2>
          <div className="space-y-5">
            <div className="relative">
              <input
                id="name"
                type="text"
                name="name"
                placeholder=" "
                value={name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              <label
                htmlFor="name"
                className={`absolute left-2 ${
                  name
                    ? "top-0 text-xs text-blue-500 bg-white px-1"
                    : "top-1/2 p-1 text-base"
                } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
              >
                Tên danh mục
              </label>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              >
                {modalOpenAddCategory1 ? "Thêm Danh Mục" : "Lưu Thay Đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddCategory1Modal;
