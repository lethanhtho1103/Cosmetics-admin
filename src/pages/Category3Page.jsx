import Header from "../components/common/Header";
import { useContext } from "react";
import CategoryContext from "../contexts/CategoryContext";
import CategoryTable3 from "../components/categories/CategoryTable3";

const Category3Page = () => {
  const { handleShowAddCategory3 } = useContext(CategoryContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Danh mục cấp 3" />
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <button
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 "
          onClick={() => handleShowAddCategory3()}
        >
          Thêm danh mục
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CategoryTable3 />
      </main>
    </div>
  );
};

export default Category3Page;
