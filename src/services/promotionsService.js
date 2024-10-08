import axios from "../axios";

const promotionsService = {
  async createPromotion({
    name,
    discount_type,
    discount_value,
    start_date,
    end_date,
  }) {
    try {
      const res = await axios.post("/api/promotions", {
        name,
        discount_type,
        discount_value,
        start_date,
        end_date,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async updatePromotion(
    id,
    { name, discount_type, discount_value, start_date, end_date }
  ) {
    try {
      const res = await axios.put(`/api/promotions/${id}`, {
        name,
        discount_type,
        discount_value,
        start_date,
        end_date,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deletePromotion(id) {
    try {
      const res = await axios.delete(`/api/promotions/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getAllPromotions() {
    try {
      const res = await axios.get("/api/promotions");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getAllPromotionsById(id) {
    try {
      const res = await axios.get(`/api/promotions/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getAllPromotionalProducts() {
    try {
      const res = await axios.get("/api/products/promotions");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default promotionsService;
