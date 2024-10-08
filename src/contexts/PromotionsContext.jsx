import { createContext, useState, useCallback, useEffect } from "react";
import promotionsService from "../services/promotionsService";
import { toast } from "react-toastify";

const PromotionsContext = createContext();

export const PromotionsProvider = ({ children }) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);
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

  const handleShowAddPromotion = () => {
    setPromotion(null);
    setModalOpenAdd(true);
  };

  const closeModal = useCallback(() => {
    setModalOpenEdit(false);
    setModalOpenAdd(false);
  }, []);

  const fetchData = async () => {
    try {
      const [promotionsData, promotionalProductsData] = await Promise.all([
        promotionsService.getAllPromotions(),
        promotionsService.getAllPromotionalProducts(),
      ]);

      setPromotions(promotionsData);
      setPromotionalProducts(promotionalProductsData);
    } catch (error) {
      toast.error("Lỗi khi tải thông tin khuyến mãi");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PromotionsContext.Provider
      value={{
        modalOpenAdd,
        modalOpenEdit,
        promotion,
        promotions,
        promotionalProducts,
        closeModal,
        handleGetAllPromotion: fetchData,
        handleGetAllPromotionalProducts: fetchData,
        handleShowEditPromotion,
        handleShowAddPromotion,
      }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};

export default PromotionsContext;
