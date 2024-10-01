import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import categoryService from "../services/categoryService";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [modalOpenAddCategory1, setModalOpenAddCategory1] = useState(false);
  const [modalOpenEditCategory1, setModalOpenEditCategory1] = useState(false);
  const [categories1, setCategories1] = useState();

  const [category1, setCategory1] = useState();

  const handleShowEditCategory1 = async (id) => {
    try {
      const res = await categoryService.getCategory1ById(id);
      setCategory1(res);
      setModalOpenEditCategory1(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const handleShowAddCategory1 = async () => {
    try {
      setCategory1();
      setModalOpenAddCategory1(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEditCategory1(false);
    setModalOpenAddCategory1(false);
  }, []);

  const handleGetAllCategories1 = async () => {
    const res = await categoryService.getCategory1();
    setCategories1(res);
  };

  useEffect(() => {
    handleGetAllCategories1();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        modalOpenAddCategory1,
        modalOpenEditCategory1,
        category1,
        categories1,
        closeModal,
        handleShowEditCategory1,
        handleShowAddCategory1,
        handleGetAllCategories1,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
