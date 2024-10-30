import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import suppliersService from "../services/suppliersService";

const SuppliersContext = createContext();

export const SuppliersProvider = ({ children }) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [suppliers, setSuppliers] = useState();
  const [supplier, setSupplier] = useState(null);

  const handleShowEditSupplier = async (id) => {
    try {
      const res = await suppliersService.getSupplierById(id);
      setSupplier(res);
      setModalOpenEdit(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const handleShowAddSupplier = async () => {
    try {
      setSupplier(null);
      setModalOpenAdd(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEdit(false);
    setModalOpenAdd(false);
  }, []);

  const handleGetAllSuppliers = async () => {
    const res = await suppliersService.getAllSuppliers();
    setSuppliers(res);
  };

  useEffect(() => {
    handleGetAllSuppliers();
  }, []);

  return (
    <SuppliersContext.Provider
      value={{
        modalOpenAdd,
        modalOpenEdit,
        supplier,
        suppliers,
        closeModal,
        handleShowEditSupplier,
        handleShowAddSupplier,
        handleGetAllSuppliers,
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
};

export default SuppliersContext;
