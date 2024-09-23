import Header from "../components/common/Header";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useEffect, useState } from "react";
import shopService from "../services/shopService";

const ProductsPage = () => {
  const [categories, setCategories] = useState();
  const handleGetAllCategories = async () => {
    const res = await shopService.getAllCategories();
    setCategories(res);
  };

  useEffect(() => {
    handleGetAllCategories();
  }, []);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sản Phẩm" />
      <button>Thêm sản phẩm</button>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ProductsTable categories={categories} />
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
        </div>
      </main>
    </div>
  );
};
export default ProductsPage;
