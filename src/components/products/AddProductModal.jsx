import { useContext, useEffect, useState } from "react";
import productService from "../../services/productService";
import { toast } from "react-toastify";
import ProductContext from "../../contexts/ProductContext";
import Select from "react-select";

const AddProductModal = ({ handleGetAllProducts, selectedCategory }) => {
  const { categories, modalOpenAdd, modalOpenEdit, closeModal, product } =
    useContext(ProductContext);
  const initialProductData = {
    name: "",
    price: "",
    quantity: "",
    trademark: "",
    origin: "",
    category_id: "",
    expiry: "",
    image: null,
    description: "",
  };
  const [productData, setProductData] = useState(initialProductData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!productData.name) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!productData.price || productData.price <= 0)
      newErrors.price = "Giá phải lớn hơn 0";
    if (!productData.quantity || productData.quantity <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!productData.trademark) newErrors.trademark = "Thương hiệu là bắt buộc";
    if (!productData.origin) newErrors.origin = "Xuất xứ là bắt buộc";
    if (!productData.category_id)
      newErrors.category_id = "Danh mục là bắt buộc";
    if (!productData.expiry || productData.expiry <= 0)
      newErrors.expiry = "Hạn sử dụng phải lớn hơn 0";
    if (!productData.image && !product)
      newErrors.image = "Hình ảnh là bắt buộc";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProductData({
      ...productData,
      [name]: files ? files[0] : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    formData.append("trademark", productData.trademark);
    formData.append("origin", productData.origin);
    formData.append("category_id", productData.category_id);
    formData.append("expiry", productData.expiry);
    formData.append("description", productData.description);
    if (productData.image && typeof productData.image !== "string") {
      formData.append("image", productData.image);
    }

    try {
      let res;
      if (modalOpenAdd) {
        res = await productService.createProduct(formData);
        toast.success(res.message);
      } else if (modalOpenEdit) {
        res = await productService.updateProduct(product._id, formData);
        toast.success(res.message);
      }
      handleGetAllProducts(selectedCategory);
      handleCloseModal(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý sản phẩm.");
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setProductData(initialProductData);
    setErrors({});
  };

  useEffect(() => {
    if (!product) {
      setProductData(initialProductData);
    } else {
      setProductData({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity || "",
        trademark: product.trademark || "",
        origin: product.origin || "",
        category_id: product.category_id || "",
        expiry: product.expiry || "",
        image: product.image || null,
        description: product.description || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return (
    (modalOpenAdd || modalOpenEdit) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {product ? "Chỉnh sửa Sản Phẩm" : "Thêm Sản Phẩm"}
          </h2>
          <div className="space-y-5">
            <div className="relative">
              <input
                id="name"
                type="text"
                name="name"
                placeholder=" "
                value={productData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              <label
                htmlFor="name"
                className={`absolute left-2  ${
                  productData.name
                    ? "top-0 text-xs text-blue-500 bg-white px-1"
                    : "top-1/2 p-1 text-base"
                } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
              >
                Tên sản phẩm
              </label>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Row for Quantity and Expiry */}
            <div className="grid grid-cols-2 gap-4">
              {/* Input for Quantity */}
              <div className="relative">
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min={1}
                  placeholder=" "
                  value={productData.quantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="quantity"
                  className={`absolute left-2 px-1 ${
                    productData.quantity
                      ? "top-0 text-xs text-blue-500 bg-white"
                      : "top-1/2 p-1 text-base"
                  } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
                >
                  Số lượng
                </label>
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              {/* Input for Expiry */}
              <div className="relative">
                <input
                  id="expiry"
                  type="number"
                  name="expiry"
                  min={1}
                  placeholder=" "
                  value={productData.expiry}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="expiry"
                  className={`absolute left-2 px-1 ${
                    productData.expiry
                      ? "top-0 text-xs text-blue-500 bg-white"
                      : "top-1/2 p-1 text-base"
                  } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
                >
                  Hạn sử dụng (tháng)
                </label>
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
            </div>

            {/* Row for Trademark and Origin */}
            <div className="grid grid-cols-2 gap-4">
              {/* Input for Trademark */}
              <div className="relative">
                <input
                  id="trademark"
                  type="text"
                  name="trademark"
                  placeholder=" "
                  value={productData.trademark}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                    errors.trademark ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="trademark"
                  className={`absolute left-2 px-1 ${
                    productData.trademark
                      ? "top-0 text-xs text-blue-500 bg-white"
                      : "top-1/2 p-1 text-base"
                  } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
                >
                  Thương hiệu
                </label>
                {errors.trademark && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.trademark}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  id="origin"
                  type="text"
                  name="origin"
                  placeholder=" "
                  value={productData.origin}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                    errors.origin ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="origin"
                  className={`absolute left-2 px-1 ${
                    productData.origin
                      ? "top-0 text-xs text-blue-500 bg-white"
                      : "top-1/2 p-1 text-base"
                  } transform -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
                >
                  Xuất xứ
                </label>
                {errors.origin && (
                  <p className="text-red-500 text-sm mt-1">{errors.origin}</p>
                )}
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Danh mục
              </label>
              <Select
                id="category_id"
                name="category_id"
                value={
                  categories
                    .map((category) => ({
                      value: category._id,
                      label: category.name,
                    }))
                    .find(
                      (option) => option.value === productData.category_id
                    ) || null
                }
                onChange={(selectedOption) =>
                  setProductData({
                    ...productData,
                    category_id: selectedOption ? selectedOption.value : "",
                  })
                }
                options={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                classNamePrefix="react-select"
                className={`capitalize w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
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

            <div className="relative">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Hình ảnh
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            <div className="relative">
              <textarea
                id="description"
                name="description"
                rows="2"
                placeholder=" "
                value={productData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 peer ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              <label
                htmlFor="description"
                className={`absolute left-2 px-1 transition-all ${
                  productData.description
                    ? "top-1 text-xs text-blue-500 bg-white"
                    : "top-1/2 text-base"
                } transform -translate-y-4 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:bg-white peer-focus:text-blue-500 peer-focus:text-xs`}
              >
                Mô tả
              </label>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
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
                {modalOpenAdd ? "Thêm Sản Phẩm" : "Lưu Thay Đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddProductModal;
