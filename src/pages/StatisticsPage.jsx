import Header from "../components/common/Header";
import { useEffect, useState, useCallback } from "react";
import statisticsService from "../services/statisticsService";
import ProductsTopSalesTable from "../components/statistics/ProductsTopSalesTable";
import YearlySales from "../components/statistics/YearlySales";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";

const StatisticsPage = () => {
  const [productsTopSales, setProductsTopSales] = useState([]);
  const [categoriesTopSales, setCategoriesTopSales] = useState([]);

  const fetchStatisticsData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        statisticsService.getProductsTopSales(),
        statisticsService.getCategoriesTopSales(),
      ]);
      setProductsTopSales(productsRes.data);
      setCategoriesTopSales(categoriesRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê:", error);
    }
  }, []);

  useEffect(() => {
    fetchStatisticsData();
  }, [fetchStatisticsData]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Thống Kê" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <YearlySales />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <ProductsTopSalesTable productsTopSales={productsTopSales} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <CategoryDistributionChart categoriesTopSales={categoriesTopSales} />
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage;
