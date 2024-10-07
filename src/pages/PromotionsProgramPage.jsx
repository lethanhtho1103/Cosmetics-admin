import Header from "../components/common/Header";
import { useContext } from "react";
import ProgramTable from "../components/promotions/PromotionTable";
import PromotionsContext from "../contexts/PromotionsContext";

const PromotionsProgramPage = () => {
  const { modalOpenAdd, modalOpenEdit, handleShowAddProduct } =
    useContext(PromotionsContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Chương Trình Khuyến Mãi" />
      {modalOpenAdd || modalOpenEdit ? (
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* <AddProduct /> */}
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
            <button
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 "
              onClick={() => handleShowAddProduct()}
            >
              Tạo chương trình
            </button>
          </div>
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <ProgramTable />
          </main>
        </>
      )}
    </div>
  );
};

export default PromotionsProgramPage;
