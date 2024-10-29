import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import productService from "../../services/productService";
import { toast } from "react-toastify";
import ReceiptContext from "../../contexts/ReceiptContext";
import Select from "react-select";
import suppliersService from "../../services/suppliersService";
import { useSelector } from "react-redux";
import receiptService from "../../services/receiptService";

const CreateReceipt = () => {
  const adminId = useSelector((state) => state.auth.login?.currentAdmin?._id);
  const { closeModal, handleGetAllReceipts } = useContext(ReceiptContext);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!selectedSupplier) newErrors.supplier_id = "Nhà cung cấp là bắt buộc";
    if (selectedProducts.length === 0)
      newErrors.details = "Phải có ít nhất một sản phẩm";
    return newErrors;
  };

  const handleProductChange = (productId, field, value) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product) =>
        product.value === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const details = selectedProducts.map((product) => ({
      product_id: product.value,
      quantity: product.quantity || 1,
      import_price: product.import_price || 0,
    }));

    const receiptData = {
      admin_id: adminId,
      supplier_id: selectedSupplier.value,
      details,
    };

    try {
      await receiptService.createReceipt(receiptData);
      setErrors({});
      handleGetAllReceipts();
      closeModal();
      toast.success("Tạo phiếu nhập thành công.");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo hóa đơn.");
    }
  };

  const fetchData = async () => {
    try {
      const [suppliersData, productsData] = await Promise.all([
        suppliersService.getAllSuppliers(),
        productService.getAllProduct(),
      ]);
      setSuppliers(suppliersData);
      setProducts(productsData.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      className="shadow-md bg-opacity-50 rounded-lg mt-2 max-w-7xl mx-auto bg-gray-800 text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-blue-500">
        Tạo Phiếu Nhập
      </h2>
      <div className="space-y-5">
        <div className="relative">
          <label htmlFor="supplier" className="block mb-1 text-white-500">
            Nhà cung cấp
          </label>
          <Select
            id="supplier"
            classNamePrefix="select"
            options={suppliers.map((supplier) => ({
              value: supplier._id,
              label: supplier.name,
            }))}
            onChange={(option) => {
              setSelectedSupplier(option);
              if (errors.supplier_id) {
                setErrors({ ...errors, supplier_id: null });
              }
            }}
            value={selectedSupplier}
            placeholder="Chọn nhà cung cấp"
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
          {errors.supplier_id && (
            <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="products" className="block mb-1 text-white-500">
            Sản phẩm
          </label>
          <Select
            id="products"
            isMulti
            classNamePrefix="select"
            options={products.map((product) => ({
              value: product._id,
              label: product.name,
            }))}
            onChange={(options) => {
              setSelectedProducts(options);
              if (errors.details) {
                setErrors({ ...errors, details: null });
              }
            }}
            value={selectedProducts}
            placeholder="Chọn sản phẩm"
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
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">{errors.details}</p>
          )}
        </div>

        {selectedProducts.map((product) => (
          <div
            key={product.value}
            className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg mt-4"
          >
            <p className="text-white">{product.label}</p>
            <input
              type="number"
              placeholder="Số lượng"
              min="1"
              value={product.quantity || ""}
              onChange={(e) =>
                handleProductChange(product.value, "quantity", e.target.value)
              }
              className="w-24 px-2 py-1 rounded text-gray-900"
            />
            <input
              type="number"
              placeholder="Giá nhập"
              min="0"
              value={product.import_price || ""}
              onChange={(e) =>
                handleProductChange(
                  product.value,
                  "import_price",
                  e.target.value
                )
              }
              className="w-32 px-2 py-1 rounded text-gray-900"
            />
          </div>
        ))}

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
            Lưu
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateReceipt;
