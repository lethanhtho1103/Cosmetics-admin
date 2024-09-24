import { useState } from "react";
import productService from "../../services/productService";
import { toast } from "react-toastify";

const AddProductModal = ({ isOpen, onClose, handleAddProduct, categories }) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    quantity: "",
    trademark: "",
    origin: "",
    category_id: "",
    expiry: "",
    image: null,
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Validation logic for required fields
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
    if (!productData.image) newErrors.image = "Hình ảnh là bắt buộc";

    return newErrors;
  };

  // Handle input and file changes
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
    if (productData.image) {
      formData.append("image", productData.image);
    }

    try {
      const res = await productService.createProduct(formData);
      handleAddProduct(); // Trigger parent update after product addition
      toast.success(res.message);
      onClose(); // Close modal
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Thêm Sản Phẩm
        </h2>
        <div className="space-y-5">
          {/* Row for Name and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Tên sản phẩm"
                value={productData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                name="price"
                min={1}
                placeholder="Giá"
                value={productData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Row for Quantity and Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="quantity"
                min={1}
                placeholder="Số lượng"
                value={productData.quantity}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                name="expiry"
                min={1}
                placeholder="Hạn sử dụng (tháng)"
                value={productData.expiry}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.expiry ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
              )}
            </div>
          </div>

          {/* Row for Trademark and Origin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="trademark"
                placeholder="Thương hiệu"
                value={productData.trademark}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.trademark ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.trademark && (
                <p className="text-red-500 text-sm mt-1">{errors.trademark}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="origin"
                placeholder="Xuất xứ"
                value={productData.origin}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.origin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.origin && (
                <p className="text-red-500 text-sm mt-1">{errors.origin}</p>
              )}
            </div>
          </div>

          {/* Image Input */}
          <div>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                errors.category_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* Description Text Area */}
          <div>
            <textarea
              name="description"
              placeholder="Mô tả sản phẩm"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 border-gray-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
