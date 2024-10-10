import { useContext, useState, useEffect, useMemo } from "react";
import promotionsService from "../../services/promotionsService";
import { toast } from "react-toastify";
import PromotionsContext from "../../contexts/PromotionsContext";
import Select from "react-select";
import productService from "../../services/productService";

const AddPromotionalProductModal = () => {
  const {
    modalOpenAddProduct,
    modalOpenEditProduct,
    closeModal,
    promotionalProduct,
    promotions,
    handleGetAllPromotionalProducts,
  } = useContext(PromotionsContext);

  const [promotionId, setPromotionId] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleGetAllProduct = async () => {
      try {
        const res = await productService.getAllProduct();
        setProducts(res.data);
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải sản phẩm.");
      }
    };
    handleGetAllProduct();

    if (modalOpenEditProduct && promotionalProduct) {
      setProductId(promotionalProduct?.product_id?._id || "");
      setPromotionId(promotionalProduct?.promotion_id?._id || "");
    }
  }, [modalOpenEditProduct, promotionalProduct]);

  const promotionOptions = useMemo(
    () =>
      promotions.map((promotion) => ({
        value: promotion._id,
        label: promotion.name,
      })),
    [promotions]
  );

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: product._id,
        label: product.name,
      })),
    [products]
  );

  const handleCloseModal = () => {
    closeModal();
    setPromotionId("");
    setProductId("");
    setErrors({});
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    if (!promotionId)
      validationErrors.promotionId = "Vui lòng chọn khuyến mãi.";
    if (!productId) validationErrors.productId = "Vui lòng chọn sản phẩm.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let res;
      if (modalOpenAddProduct) {
        res = await promotionsService.createPromotionalProduct({
          product_id: productId,
          promotion_id: promotionId,
        });
      } else if (modalOpenEditProduct) {
        res = await promotionsService.updatePromotionalProduct(
          promotionalProduct._id,
          {
            product_id: productId,
            promotion_id: promotionId,
          }
        );
      }

      handleGetAllPromotionalProducts();
      toast.success(res.message);
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý khuyến mãi.");
    }
  };

  return (
    (modalOpenAddProduct || modalOpenEditProduct) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {modalOpenEditProduct ? "Chỉnh Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="promotion_id" className="block text-gray-700">
                Chọn Khuyến Mãi
              </label>
              <Select
                id="promotion_id"
                name="promotion_id"
                value={promotionOptions.find(
                  (opt) => opt.value === promotionId
                )}
                onChange={(option) => setPromotionId(option.value)}
                options={promotionOptions}
                placeholder="Chọn khuyến mãi"
                classNamePrefix="react-select"
                className={`w-full capitalize border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.promotionId ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.promotionId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.promotionId}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="product_id" className="block text-gray-700">
                Chọn Sản Phẩm
              </label>
              <Select
                id="product_id"
                name="product_id"
                value={productOptions.find((opt) => opt.value === productId)}
                onChange={(option) => setProductId(option.value)}
                options={productOptions}
                placeholder="Chọn sản phẩm"
                classNamePrefix="react-select"
                className={`w-full capitalize border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 ${
                  errors.productId ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.productId && (
                <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              >
                {modalOpenAddProduct ? "Thêm" : "Cập Nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddPromotionalProductModal;
