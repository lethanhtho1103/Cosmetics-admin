import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import productService from "../../services/productService";
import { toast } from "react-toastify";
import ProductContext from "../../contexts/ProductContext";
import Select from "react-select";
import { baseUrl } from "../../axios";

const AddProduct = () => {
  const { categories, product, closeModal } = useContext(ProductContext);
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

  const inputRef = useRef();

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
      if (!product) {
        res = await productService.createProduct(formData);
        toast.success(res.message);
      } else {
        res = await productService.updateProduct(product._id, formData);
        toast.success(res.message);
      }
      // setProductData(initialProductData);
      setErrors({});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý sản phẩm.");
    }
  };

  const handleImageDelete = () => {
    setProductData({ ...productData, image: null });
    inputRef.current.value = null;
  };

  useEffect(() => {
    if (product) {
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
    } else {
      setProductData(initialProductData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return (
    <motion.div
      className="shadow-md  bg-opacity-50  rounded-lg mt-2 max-w-7xl mx-auto bg-gray-800 text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-blue-500">
        {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
      </h2>
      <div className="space-y-5">
        <div className="relative">
          <label htmlFor="category" className="block mb-1 text-white-500">
            Danh mục
          </label>
          <Select
            id="category"
            classNamePrefix="select"
            className="text-gray-200 bg-gray-700 border-gray-600"
            options={categories?.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            onChange={(option) => {
              setProductData({ ...productData, category_id: option.value });
              if (errors.category_id) {
                setErrors({ ...errors, category_id: null });
              }
            }}
            value={
              categories
                .map((category) => ({
                  value: category._id,
                  label: category.name,
                }))
                .find((option) => option.value === productData.category_id) ||
              null
            }
            placeholder="Chọn danh mục"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "#2d3748",
                color: "white",
                textTransform: "capitalize",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white",
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#2d3748",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#4a5568" : "#2d3748",
                color: "white",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#4a5568",
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#a0aec0",
              }),
              input: (provided) => ({
                ...provided,
                color: "white",
              }),
            }}
          />
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="name" className="block mb-1 text-white-500">
              Tên sản phẩm
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder=" "
              value={productData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="price" className="block mb-1 text-white-500">
              Giá sản phẩm
            </label>
            <input
              id="price"
              type="number"
              name="price"
              min={1}
              placeholder=" "
              value={productData.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.price ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="quantity" className="block mb-1 text-white-500">
              Số lượng
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min={1}
              placeholder=" "
              value={productData.quantity}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.quantity ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="expiry" className="block mb-1 text-white-500">
              Hạn sử dụng (tháng)
            </label>
            <input
              id="expiry"
              type="number"
              name="expiry"
              min={1}
              placeholder=" "
              value={productData.expiry}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.expiry ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.expiry && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="trademark" className="block mb-1 text-white-500">
              Thương hiệu
            </label>
            <input
              id="trademark"
              type="text"
              name="trademark"
              placeholder=" "
              value={productData.trademark}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.trademark ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.trademark && (
              <p className="text-red-500 text-sm mt-1">{errors.trademark}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="origin" className="block mb-1 text-white-500">
              Xuất xứ
            </label>
            <input
              id="origin"
              type="text"
              name="origin"
              placeholder=" "
              value={productData.origin}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 ${
                errors.origin ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.origin && (
              <p className="text-red-500 text-sm mt-1">{errors.origin}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <label htmlFor="image" className="block mb-1 text-white-500">
            Hình ảnh
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            ref={inputRef}
            onChange={handleChange}
            className="text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2 px-4 rounded-lg"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {productData.image && (
          <div className="relative mt-4 flex items-center">
            <img
              src={
                typeof productData.image === "object"
                  ? URL.createObjectURL(productData.image)
                  : `${baseUrl}/${productData.image}`
              }
              alt="Selected"
              className="w-32 h-32 object-cover rounded-lg mr-2"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-1 px-3 transition duration-300 ease-in-out shadow-md"
            >
              Xóa
            </button>
          </div>
        )}

        <div className="relative">
          <label htmlFor="description" className="block mb-1 text-white-500">
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            name="description"
            placeholder=" "
            value={productData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-200 bg-gray-700 peer ${
              errors.description ? "border-red-500" : "border-gray-600"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded mr-4"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
          >
            {product ? "Cập Nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProduct;
