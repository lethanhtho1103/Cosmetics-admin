import { createContext, useState, useCallback, useEffect } from "react";
import promotionsService from "../services/promotionsService";
import { toast } from "react-toastify";

const PromotionsContext = createContext();

export const PromotionsProvider = ({ children }) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [promotions, setPromotions] = useState();
  const [promotion, setPromotion] = useState(null);

  const handleShowEditPromotion = async (id) => {
    try {
      const res = await promotionsService.getAllPromotionsById(id);
      setPromotion(res);
      setModalOpenEdit(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin khuyễn mãi");
    }
  };

  const handleShowAddPromotion = async () => {
    try {
      setPromotion(null);
      setModalOpenAdd(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin khuyễn mãi");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEdit(false);
    setModalOpenAdd(false);
  }, []);

  const handleGetAllPromotion = async () => {
    const res = await promotionsService.getAllPromotions();
    setPromotions(res);
  };

  useEffect(() => {
    handleGetAllPromotion();
  }, []);

  return (
    <PromotionsContext.Provider
      value={{
        modalOpenAdd,
        modalOpenEdit,
        promotion,
        promotions,
        closeModal,
        handleGetAllPromotion,
        handleShowEditPromotion,
        handleShowAddPromotion,
      }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};

export default PromotionsContext;
