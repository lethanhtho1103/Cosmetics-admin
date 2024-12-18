import axios from "../axios";

const statisticsService = {
  async getStatistics() {
    try {
      const res = await axios.get("/api/statistics");
      return res;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getCategoriesTopSales() {
    try {
      const res = await axios.get("/api/statistics/top-categories-sales");
      return res;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getProductsTopSales() {
    try {
      const res = await axios.get("/api/statistics/top-products-sales");
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getOrderStatisticsByMonth({ year, month }) {
    try {
      const res = await axios.get("/api/statistics/order/month", {
        params: {
          year,
          month,
        },
      });
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getOrderStatisticsByYear({ year }) {
    try {
      const res = await axios.get("/api/statistics/order/year", {
        params: {
          year,
        },
      });
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },
};

export default statisticsService;
