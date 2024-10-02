import { useContext, useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";
import CategoryContext from "../../contexts/CategoryContext";
import Select from "react-select";

const AddCategory1Modal = ({ selectedCategory1 }) => {
  const {
    modalOpenAddCategory1,
    modalOpenEditCategory1,
    modalOpenAddCategory2,
    modalOpenEditCategory2,
    closeModal,
    categories1,
    category1,
    category2,
    handleGetAllCategories1,
    handleGetAllCategories2,
  } = useContext(CategoryContext);

  const isModalEdit = modalOpenEditCategory1 || modalOpenEditCategory2;
  const isModalAdd = modalOpenAddCategory1 || modalOpenAddCategory2;

  const [name, setName] = useState("");
  const [category_id, setCategory_id] = useState("");

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
        handleGetAllCategories1();
      } else if (modalOpenEditCategory1) {
        res = await categoryService.updateCategory1(category1._id, { name });
        toast.success(res.message);
        handleGetAllCategories1();
      } else if (modalOpenAddCategory2) {
        res = await categoryService.createCategory2({ category_id, name });
        toast.success(res.message);
        handleGetAllCategories2(selectedCategory1);
      } else if (modalOpenEditCategory2) {
        res = await categoryService.updateCategory2(category2._id, {
          category_id,
          name,
        });
        toast.success(res.message);
        handleGetAllCategories2(selectedCategory1);
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý danh mục.");
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setName("");
    setCategory_id("");
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

  useEffect(() => {
    if (category2) {
      setName(category2.name || "");
      setCategory_id(category2?.shop_id || "");
    } else {
      setName("");
      setCategory_id("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category2]);

  return (
    (isModalAdd || isModalEdit) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isModalEdit ? "Chỉnh Sửa Danh mục" : "Thêm Danh Mục"}
          </h2>
          <div className="space-y-5">
            {(modalOpenAddCategory2 || modalOpenEditCategory2) && (
              <div>
                <Select
                  id="category_id"
                  name="category_id"
                  value={
                    categories1
                      .map((category) => ({
                        value: category._id,
                        label: category.name,
                      }))
                      .find((option) => option.value === category_id) || null
                  }
                  onChange={(selectedOption) =>
                    setCategory_id(selectedOption ? selectedOption.value : "")
                  }
                  options={categories1.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                  classNamePrefix="react-select"
                  className={`w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                    errors.category_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Chọn danh mục"
                />
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id}
                  </p>
                )}
              </div>
            )}
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
