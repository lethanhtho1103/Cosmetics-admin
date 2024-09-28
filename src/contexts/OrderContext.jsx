import { createContext, useState, useEffect } from "react";
// import { toast } from "react-toastify";
import orderService from "../services/orderService";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const handleGetAllOrders = async () => {
    const res = await orderService.getAllOrder();
    setOrders(res?.data);
  };

  useEffect(() => {
    handleGetAllOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        handleGetAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
