import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import receiptService from "../services/receiptService";

const ReceiptContext = createContext();

export const ReceiptProvider = ({ children }) => {
  const [modalOpenCreate, setModalOpenCreate] = useState(false);
  const [modalOpenEditReceiptDetail, setModalOpenEditReceiptDetail] =
    useState(false);
  const [receipts, setReceipts] = useState();
  const [receiptDetail, setReceiptDetail] = useState(null);

  const handleShowEditReceiptDetail = async (id) => {
    try {
      const res = await receiptService.getReceiptDetailById(id);
      setReceiptDetail(res);
      setModalOpenEditReceiptDetail(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const handleShowAddReceipt = async () => {
    try {
      setReceiptDetail(null);
      setModalOpenCreate(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEditReceiptDetail(false);
    setModalOpenCreate(false);
  }, []);

  const handleGetAllReceipts = async () => {
    const res = await receiptService.getAllReceipts();
    setReceipts(res);
  };

  useEffect(() => {
    handleGetAllReceipts();
  }, []);

  return (
    <ReceiptContext.Provider
      value={{
        modalOpenCreate,
        modalOpenEditReceiptDetail,
        receiptDetail,
        receipts,
        closeModal,
        handleShowEditReceiptDetail,
        handleShowAddReceipt,
        handleGetAllReceipts,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};

export default ReceiptContext;
