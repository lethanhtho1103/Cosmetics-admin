import { createContext, useState, useCallback, useEffect } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";
import shopService from "../services/shopService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [categories, setCategories] = useState();

  const [product, setProduct] = useState(null);

  const handleShowEditProduct = async (nameProduct) => {
    try {
      const res = await productService.getProductByName({ nameProduct });
      setProduct(res.data);
      setModalOpenEdit(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const handleShowAddProduct = async () => {
    try {
      setProduct(null);
      setModalOpenAdd(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm");
    }
  };

  const closeModal = useCallback(() => {
    setModalOpenEdit(false);
    setModalOpenAdd(false);
  }, []);

  const handleGetAllCategories = async () => {
    const res = await shopService.getAllCategories();
    setCategories(res);
  };

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    handleGetAllCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        modalOpenAdd,
        modalOpenEdit,
        product,
        categories,
        closeModal,
        handleShowEditProduct,
        handleShowAddProduct,
        formatNumber,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
