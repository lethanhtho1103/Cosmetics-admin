import axios from "../axios";

const categoryService = {
  async getCategory1() {
    try {
      const res = await axios.get("/api/shop");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getCategory1ById(id) {
    try {
      const res = await axios.get(`/api/shop/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async createCategory1({ name }) {
    try {
      const res = await axios.post("/api/shop", {
        name,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteCategory1(id) {
    try {
      const res = await axios.delete(`/api/shop/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateCategory1(id, { name }) {
    try {
      const res = await axios.put(`/api/shop/${id}`, {
        name,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getCategory2() {
    try {
      const res = await axios.get("/api/cosmetic");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getCategory2ById(id) {
    try {
      const res = await axios.get(`/api/cosmetic/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async createCategory2({ category_id, name }) {
    try {
      const res = await axios.post("/api/cosmetic", {
        shop_id: category_id,
        name,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteCategory2(id) {
    try {
      const res = await axios.delete(`/api/cosmetic/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateCategory2(id, { category_id, name }) {
    try {
      const res = await axios.put(`/api/cosmetic/${id}`, {
        shop_id: category_id,
        name,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getCategory3() {
    try {
      const res = await axios.get("/api/category");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  // async createProduct(formData) {
  //   try {
  //     const res = await axios.post("/api/product", formData);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  // async deleteProduct(productId) {
  //   try {
  //     const res = await axios.delete(`/api/product/${productId}`);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};

export default categoryService;
