import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import categoryService from "../services/categoryService";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [modalOpenAddCategory1, setModalOpenAddCategory1] = useState(false);
  const [modalOpenEditCategory1, setModalOpenEditCategory1] = useState(false);
  const [categories1, setCategories1] = useState([]);
  const [category1, setCategory1] = useState({});
  const [modalOpenAddCategory2, setModalOpenAddCategory2] = useState(false);
  const [modalOpenEditCategory2, setModalOpenEditCategory2] = useState(false);
  const [categories2, setCategories2] = useState([]);
  const [category2, setCategory2] = useState({});
  const handleShowAddCategory1 = async () => {
    try {
      setCategory1({});
      setModalOpenAddCategory1(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin danh mục");
    }
  };

  const handleShowEditCategory1 = async (id) => {
    try {
      const res = await categoryService.getCategory1ById(id);
      setCategory1(res);
      setModalOpenEditCategory1(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin danh mục");
    }
  };

  const handleShowAddCategory2 = async () => {
    try {
      setCategory2({});
      setModalOpenAddCategory2(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin danh mục");
    }
  };

  const handleShowEditCategory2 = async (id) => {
    try {
      const res = await categoryService.getCategory2ById(id);
      setCategory2(res);
      setModalOpenEditCategory2(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin danh mục");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEditCategory1(false);
    setModalOpenAddCategory1(false);
    setModalOpenEditCategory2(false);
    setModalOpenAddCategory2(false);
  }, []);

  const handleGetAllCategories1 = async () => {
    const res = await categoryService.getCategory1();
    setCategories1(res);
  };

  const handleGetAllCategories2 = useCallback(async (categoryId) => {
    if (categoryId) {
      try {
        const res = await categoryService.getCategory1ById(categoryId);
        setCategories2(res?.cosmetics || []);
        // setFilteredCategories(res?.cosmetics || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  }, []);

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
        modalOpenAddCategory2,
        modalOpenEditCategory2,
        category2,
        categories2,
        handleShowEditCategory2,
        handleShowAddCategory2,
        handleGetAllCategories2,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
