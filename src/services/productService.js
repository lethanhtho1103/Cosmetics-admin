import axios from "../axios";

const productService = {
  async getAllProductByCategoryName({
    categoryName = "",
    sortBy = "name",
    order = "asc",
    minPrice = 0,
    maxPrice = Infinity,
    trademark = [],
  }) {
    try {
      const res = await axios.get("/api/product", {
        params: {
          categoryName,
          sortBy,
          order,
          minPrice,
          maxPrice,
          trademark,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getProductByName({ nameProduct }) {
    try {
      const res = await axios.get("/api/product/get-by-name", {
        params: {
          nameProduct,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default productService;
