import Header from "../components/common/Header";
import ProductsTable from "../components/products/ProductsTable";
import { useContext } from "react";
import ProductContext from "../contexts/ProductContext";
import AddProduct from "../components/products/AddProduct";
import { CirclePlus } from "lucide-react";

const ProductsPage = () => {
  const { modalOpenAdd, modalOpenEdit, handleShowAddProduct } =
    useContext(ProductContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sản Phẩm" />
      {modalOpenAdd || modalOpenEdit ? (
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <AddProduct />
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 "
              onClick={() => handleShowAddProduct()}
            >
              <CirclePlus size={20} className="mr-1" />
              Thêm sản phẩm
            </button>
          </div>
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <ProductsTable />
          </main>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
