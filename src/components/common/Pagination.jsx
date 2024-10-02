const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  filteredCategoriesLength,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <span className="text-gray-400 mr-2">Hiển thị</span>
        <select
          className="bg-gray-700 text-white py-2 px-4 rounded"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num}/{filteredCategoriesLength}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center">
        <button
          className={`bg-gray-600 text-white py-2 px-4 rounded mr-2 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="text-gray-400">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className={`bg-gray-600 text-white py-2 px-4 rounded ml-2 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default Pagination;
