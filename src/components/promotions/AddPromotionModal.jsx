import { useContext, useEffect, useState, useCallback } from "react";
import promotionsService from "../../services/promotionsService";
import { toast } from "react-toastify";
import PromotionsContext from "../../contexts/PromotionsContext";

const AddPromotionModal = () => {
  const {
    modalOpenAdd,
    modalOpenEdit,
    closeModal,
    promotion,
    handleGetAllPromotion,
  } = useContext(PromotionsContext);

  const [name, setName] = useState("");
  const [discount_type, setDiscountType] = useState("");
  const [discount_value, setDiscountValue] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const validate = useCallback(() => {
    const newErrors = {};
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const todayDateObj = new Date(today);

    if (!name) newErrors.name = "Tên khuyến mãi là bắt buộc";
    if (!discount_type) newErrors.discount_type = "Loại khuyến mãi là bắt buộc";
    if (!discount_value && discount_type !== "buy_one_get_one") {
      newErrors.discount_value = "Giá trị khuyến mãi là bắt buộc";
    }
    if (discount_value < 0 && discount_type !== "buy_one_get_one") {
      newErrors.discount_value = "Giá trị khuyến mãi không được âm";
    }
    if (!start_date) newErrors.start_date = "Ngày bắt đầu là bắt buộc";
    if (!end_date) newErrors.end_date = "Ngày kết thúc là bắt buộc";
    if (startDateObj < todayDateObj) {
      newErrors.start_date = "Ngày bắt đầu phải lớn hơn ngày hiện tại";
    }
    if (endDateObj <= startDateObj) {
      newErrors.end_date = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    }
    if (endDateObj < todayDateObj) {
      newErrors.end_date = "Ngày kết thúc phải lớn hơn ngày hiện tại";
    }
    return newErrors;
  }, [name, discount_type, discount_value, start_date, end_date, today]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }

      switch (name) {
        case "name":
          setName(value);
          break;
        case "discount_type":
          setDiscountType(value);
          if (value === "buy_one_get_one") {
            setDiscountValue(0);
          }
          break;
        case "discount_value":
          setDiscountValue(value);
          break;
        case "start_date":
          setStartDate(value);
          break;
        case "end_date":
          setEndDate(value);
          break;
        default:
          break;
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
      if (modalOpenAdd) {
        res = await promotionsService.createPromotion({
          name,
          discount_type,
          discount_value,
          start_date,
          end_date,
        });
      } else if (modalOpenEdit) {
        res = await promotionsService.updatePromotion(promotion._id, {
          name,
          discount_type,
          discount_value,
          start_date,
          end_date,
        });
      }

      handleGetAllPromotion();
      toast.success(res.message);
      setName("");
      setDiscountType("");
      setDiscountValue("");
      setStartDate("");
      setEndDate("");
      setErrors({});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý khuyến mãi.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate, modalOpenAdd, modalOpenEdit, promotion]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setName("");
    setDiscountType("");
    setDiscountValue("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  }, [closeModal]);

  useEffect(() => {
    if (promotion && modalOpenEdit) {
      setName(promotion.name || "");
      setDiscountType(promotion.discount_type || "");
      setDiscountValue(promotion.discount_value || "");
      setStartDate(formatDate(promotion.start_date) || "");
      setEndDate(formatDate(promotion.end_date) || "");
    }
  }, [promotion, modalOpenEdit]);

  return (
    (modalOpenAdd || modalOpenEdit) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {modalOpenEdit ? "Chỉnh Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="name" className="block text-gray-700">
                Tên Khuyến Mãi
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Nhập tên khuyến mãi"
                value={name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="discount_type" className="block text-gray-700">
                Loại Khuyến Mãi
              </label>
              <select
                id="discount_type"
                name="discount_type"
                value={discount_type}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.discount_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn loại khuyến mãi</option>
                <option value="percent">Phần Trăm</option>
                <option value="buy_one_get_one">Mua 1 tặng 1</option>
              </select>
              {errors.discount_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_type}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="discount_value" className="block text-gray-700">
                Giá trị khuyến mãi
              </label>
              <input
                id="discount_value"
                type="number"
                name="discount_value"
                placeholder="Nhập giá trị khuyến mãi"
                value={discount_value}
                onChange={handleChange}
                min={1}
                disabled={discount_type === "buy_one_get_one"}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.discount_value ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.discount_value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_value}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="start_date" className="block text-gray-700">
                Ngày Bắt Đầu
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={start_date}
                min={today} // Set min to today
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.start_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="end_date" className="block text-gray-700">
                Ngày Kết Thúc
              </label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={end_date}
                min={today}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.end_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
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
                {modalOpenAdd ? "Thêm" : "Cập Nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddPromotionModal;
