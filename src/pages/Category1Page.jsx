import Header from "../components/common/Header";
import { useContext } from "react";
import CategoryContext from "../contexts/CategoryContext";
import CategoryTable from "../components/categories/CategoryTable";
import { CirclePlus } from "lucide-react";

const Category1Page = () => {
  const { handleShowAddCategory1 } = useContext(CategoryContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Danh mục cấp 1" />
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center  px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 "
          onClick={() => handleShowAddCategory1()}
        >
          <CirclePlus size={20} className="mr-1" />
          Thêm danh mục
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <CategoryTable />
      </main>
    </div>
  );
};

export default Category1Page;
