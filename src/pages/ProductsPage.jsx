import Header from "../components/common/Header";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import AddProductModal from "../components/products/AddProductModal"; // Import modal
import { useEffect, useState } from "react";
import shopService from "../services/shopService";

const ProductsPage = () => {
  const [categories, setCategories] = useState();
  const [modalOpen, setModalOpen] = useState(false);

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
      <button
        className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 mt-4 mx-8"
        onClick={() => setModalOpen(true)}
      >
        Thêm sản phẩm
      </button>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
      />

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
