import Header from "../components/common/Header";
// import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useContext } from "react";
import ProductContext from "../contexts/ProductContext";

const ProductsPage = () => {
  const { handleShowAddProduct } = useContext(ProductContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sản Phẩm" />
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <button
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 "
          onClick={() => handleShowAddProduct()}
        >
          Thêm sản phẩm
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ProductsTable />
        {/* <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
        </div> */}
      </main>
    </div>
  );
};

export default ProductsPage;
