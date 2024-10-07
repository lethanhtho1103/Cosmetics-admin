import axios from "../axios";

const promotionsService = {
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
      const res = await axios.get(`/api/promotions${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default promotionsService;
