import Header from "../components/common/Header";
import { useContext } from "react";
import { PackagePlus } from "lucide-react"; // Import the icon
import ReceiptContext from "../contexts/ReceiptContext";
import ReceiptTable from "../components/receipts/ReceiptTable";
import CreateReceipt from "../components/receipts/CreateReceipt";

const ReceiptsPage = () => {
  const { modalOpenCreate, handleShowAddReceipt } = useContext(ReceiptContext);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Phiếu nhập" />
      {modalOpenCreate ? (
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <CreateReceipt />
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300"
              onClick={() => handleShowAddReceipt()}
            >
              <PackagePlus size={20} className="mr-1" />
              Tạo phiếu nhập
            </button>
          </div>
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <ReceiptTable />
          </main>
        </>
      )}
    </div>
  );
};

export default ReceiptsPage;
