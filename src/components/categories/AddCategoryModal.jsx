import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";
import CategoryContext from "../../contexts/CategoryContext";
import Select from "react-select";

const AddCategoryModal = ({
  selectedCategory1,
  selectedCategory2,
  categories2,
}) => {
  const {
    modalOpenAddCategory1,
    modalOpenEditCategory1,
    modalOpenAddCategory2,
    modalOpenEditCategory2,
    modalOpenAddCategory3,
    modalOpenEditCategory3,
    closeModal,
    categories1,
    category1,
    category2,
    category3,
    handleGetAllCategories1,
    handleGetAllCategories2,
    handleGetAllCategories3,
  } = useContext(CategoryContext);

  const isModalEdit = useMemo(
    () =>
      modalOpenEditCategory1 ||
      modalOpenEditCategory2 ||
      modalOpenEditCategory3,
    [modalOpenEditCategory1, modalOpenEditCategory2, modalOpenEditCategory3]
  );
  const isModalAdd = useMemo(
    () =>
      modalOpenAddCategory1 || modalOpenAddCategory2 || modalOpenAddCategory3,
    [modalOpenAddCategory1, modalOpenAddCategory2, modalOpenAddCategory3]
  );

  const [name, setName] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên danh mục là bắt buộc";
    return newErrors;
  }, [name]);

  const handleChange = useCallback(
    (e) => {
      const { value } = e.target;
      setName(value);
      if (errors.name) {
        setErrors({ ...errors, name: null });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      let res;
      if (modalOpenAddCategory1) {
        res = await categoryService.createCategory1({ name });
        handleGetAllCategories1();
      } else if (modalOpenEditCategory1) {
        res = await categoryService.updateCategory1(category1._id, { name });
        handleGetAllCategories1();
      } else if (modalOpenAddCategory2) {
        res = await categoryService.createCategory2({ category_id, name });
        handleGetAllCategories2(selectedCategory1);
      } else if (modalOpenEditCategory2) {
        res = await categoryService.updateCategory2(category2._id, {
          category_id,
          name,
        });
        handleGetAllCategories2(selectedCategory1);
      } else if (modalOpenAddCategory3) {
        res = await categoryService.createCategory3({ category_id, name });
        handleGetAllCategories3(selectedCategory2);
      } else if (modalOpenEditCategory3) {
        res = await categoryService.updateCategory3(category3._id, {
          category_id,
          name,
        });
        handleGetAllCategories3(selectedCategory2);
      }
      toast.success(res.message);
      setName("");
      setErrors({});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý danh mục.");
    }
  }, [
    category1,
    category2,
    category3,
    category_id,
    handleGetAllCategories1,
    handleGetAllCategories2,
    handleGetAllCategories3,
    modalOpenAddCategory1,
    modalOpenAddCategory2,
    modalOpenAddCategory3,
    modalOpenEditCategory1,
    modalOpenEditCategory2,
    modalOpenEditCategory3,
    name,
    selectedCategory1,
    selectedCategory2,
    validate,
  ]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setName("");
    setCategory_id("");
    setErrors({});
  }, [closeModal]);

  useEffect(() => {
    if (category1) setName(category1.name || "");
    else setName("");
  }, [category1]);

  useEffect(() => {
    if (category2) {
      setName(category2.name || "");
      setCategory_id(category2.shop_id || "");
    } else {
      setName("");
      setCategory_id("");
    }
  }, [category2]);

  useEffect(() => {
    if (category3) {
      setName(category3.name || "");
      setCategory_id(category3.cosmetic_id || "");
    } else {
      setName("");
      setCategory_id("");
    }
  }, [category3]);

  return (
    (isModalAdd || isModalEdit) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isModalEdit
              ? `Chỉnh Sửa ${
                  modalOpenEditCategory1
                    ? "Danh Mục 1"
                    : modalOpenEditCategory2
                    ? "Danh Mục 2"
                    : "Danh Mục 3"
                }`
              : `Thêm ${
                  modalOpenAddCategory1
                    ? "Danh Mục 1"
                    : modalOpenAddCategory2
                    ? "Danh Mục 2"
                    : "Danh Mục 3"
                }`}
          </h2>
          <div className="space-y-5">
            <div className="relative">
              {(modalOpenAddCategory2 || modalOpenEditCategory2) && (
                <CategorySelect
                  label="Danh mục 1"
                  options={categories1}
                  value={category_id}
                  onChange={setCategory_id}
                  error={errors.category_id}
                />
              )}
              {(modalOpenAddCategory3 || modalOpenEditCategory3) && (
                <CategorySelect
                  label="Danh mục 2"
                  options={categories2}
                  value={category_id}
                  onChange={setCategory_id}
                  error={errors.category_id}
                />
              )}
            </div>
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
                {isModalAdd ? "Thêm Danh Mục" : "Lưu Thay Đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const CategorySelect = ({ label, options, value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select
        value={
          options
            .map((category) => ({ value: category._id, label: category.name }))
            .find((option) => option.value === value) || null
        }
        onChange={(selectedOption) =>
          onChange(selectedOption ? selectedOption.value : "")
        }
        options={options.map((category) => ({
          value: category._id,
          label: category.name,
        }))}
        classNamePrefix="react-select"
        className={`w-full capitalize border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={`Chọn ${label}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default AddCategoryModal;
