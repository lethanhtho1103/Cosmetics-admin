import { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import ReceiptContext from "../../contexts/ReceiptContext";
import receiptService from "../../services/receiptService";

const UpdateReceiptDetail = () => {
  const { receiptDetail, modalOpenEditReceiptDetail, closeModal } =
    useContext(ReceiptContext);

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [importPrice, setImportPrice] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (receiptDetail) {
      setProductName(receiptDetail.product_id.name);
      setQuantity(receiptDetail.quantity);
      setImportPrice(receiptDetail.import_price);
    }
  }, [receiptDetail]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!quantity || quantity <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!importPrice || importPrice <= 0)
      newErrors.importPrice = "Đơn giá phải lớn hơn 0";
    return newErrors;
  }, [quantity, importPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") setQuantity(Number(value));
    else if (name === "importPrice") setImportPrice(Number(value));

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await receiptService.updateReceiptDetail({
        receiptDetailId: receiptDetail._id,
        quantity,
        import_price: importPrice,
      });
      toast.success("Cập nhật chi tiết phiếu nhập thành công");
      closeModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật chi tiết phiếu nhập.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate, closeModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setQuantity(0);
    setImportPrice(0);
    setErrors({});
  }, [closeModal]);

  return (
    modalOpenEditReceiptDetail && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Chỉnh Sửa Chi Tiết Phiếu Nhập
          </h2>
          <div className="space-y-5">
            <div className="relative">
              <input
                type="text"
                value={productName}
                disabled
                className="w-full px-4 py-2 border rounded-lg text-gray-800 bg-gray-200"
              />
              <label className="absolute left-2 top-0 text-xs text-blue-500 bg-white px-1">
                Tên sản phẩm
              </label>
            </div>
            <div className="relative">
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              <label
                htmlFor="quantity"
                className="absolute left-2 top-0 text-xs text-blue-500 bg-white px-1"
              >
                Số lượng
              </label>
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
            <div className="relative">
              <input
                id="importPrice"
                type="number"
                name="importPrice"
                value={importPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.importPrice ? "border-red-500" : "border-gray-300"
                }`}
              />
              <label
                htmlFor="importPrice"
                className="absolute left-2 top-0 text-xs text-blue-500 bg-white px-1"
              >
                Đơn giá
              </label>
              {errors.importPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.importPrice}
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
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateReceiptDetail;
