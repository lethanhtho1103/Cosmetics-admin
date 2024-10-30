import { useContext, useEffect, useState, useCallback } from "react";
import suppliersService from "../../services/suppliersService";
import { toast } from "react-toastify";
import SuppliersContext from "../../contexts/SuppliersContext";

const AddSupplierModal = () => {
  const {
    modalOpenAdd,
    modalOpenEdit,
    closeModal,
    supplier,
    handleGetAllSuppliers,
  } = useContext(SuppliersContext);

  console.log(supplier);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên là bắt buộc";
    if (name.length < 3 || name.length > 50)
      newErrors.name = "Tên phải từ 3 đến 50 ký tự";
    if (!email) newErrors.email = "Email là bắt buộc";
    if (email.length < 10 || email.length > 35)
      newErrors.email = "Email phải từ 10 đến 35 ký tự";
    if (address && address.length < 2)
      newErrors.address = "Địa chỉ phải có ít nhất 2 ký tự";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc";
    return newErrors;
  }, [name, email, address, phone]);

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
        case "email":
          setEmail(value);
          break;
        case "address":
          setAddress(value);
          break;
        case "phone":
          setPhone(value);
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
      if (modalOpenAdd) {
        await suppliersService.createSupplier({
          name,
          email,
          address,
          phone,
        });
        toast.success("Thêm nhà cung cấp thành công.");
        setName("");
        setEmail("");
        setAddress("");
        setPhone("");
      } else if (modalOpenEdit) {
        await suppliersService.updateSupplier(supplier._id, {
          name,
          email,
          address,
          phone,
        });
        toast.success("Cập nhật cung cấp thành công.");
      }
      handleGetAllSuppliers();
      setErrors({});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý nhà cung cấp.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validate, modalOpenAdd, modalOpenEdit, supplier]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setErrors({});
  }, [closeModal]);

  useEffect(() => {
    if (supplier && modalOpenEdit) {
      setName(supplier.name || "");
      setEmail(supplier.email || "");
      setAddress(supplier.address || "");
      setPhone(supplier.phone || "");
    }
  }, [supplier, modalOpenEdit]);

  return (
    (modalOpenAdd || modalOpenEdit) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {modalOpenEdit ? "Chỉnh Sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="name" className="block text-gray-700">
                Tên Nhà Cung Cấp
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Nhập tên nhà cung cấp"
                value={name}
                onChange={handleChange}
                className={`w-full text-gray-800  px-4 py-2 border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Nhập email"
                value={email}
                onChange={handleChange}
                className={`w-full text-gray-800  px-4 py-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="address" className="block text-gray-700">
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={handleChange}
                className={`w-full text-gray-800  px-4 py-2 border rounded-lg ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="phone" className="block text-gray-700">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={handleChange}
                className={`w-full text-gray-800  px-4 py-2 border rounded-lg ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
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

export default AddSupplierModal;
