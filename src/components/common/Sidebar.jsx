import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  ChevronDown,
  ChevronUp,
  GiftIcon,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Tổng Quan",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
  },
  {
    name: "Danh Mục Sản Phẩm",
    icon: ShoppingBag,
    color: "#8B5CF6",
    subItems: [
      {
        name: "Danh Mục Cấp 1",
        href: "/products/category1",
      },
      {
        name: "Danh Mục Cấp 2",
        href: "/products/category2",
      },
      {
        name: "Danh Mục Cấp 3",
        href: "/products/category3",
      },
      {
        name: "Sản Phẩm",
        href: "/products",
      },
    ],
  },
  {
    name: "Khuyến Mãi",
    icon: GiftIcon,
    color: "orange",
    subItems: [
      {
        name: "Chương Trình Khuyến Mãi",
        href: "/promotion/program",
      },
      {
        name: "Sản Phẩm Khuyến Mãi",
        href: "/promotion/product",
      },
    ],
  },
  { name: "Người Dùng", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Doanh Số", icon: DollarSign, color: "#10B981", href: "/sales" },
  { name: "Đơn Hàng", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  { name: "Tài khoản", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  const isSubItemActive = (subItems) => {
    return subItems?.some((subItem) => location.pathname === subItem.href);
  };

  const handleSubMenuToggle = (itemName) => {
    setOpenSubMenu((prev) => (prev === itemName ? null : itemName));
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href || isSubItemActive(item.subItems);

            return (
              <div key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => {
                    if (item.subItems) {
                      handleSubMenuToggle(item.name);
                    }
                  }}
                >
                  <motion.div
                    className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
                      isActive ? "text-green-500" : "text-white"
                    }`}
                  >
                    <item.icon
                      size={20}
                      style={{ color: item.color, minWidth: "20px" }}
                    />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap flex-grow"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {/* Dropdown arrow */}
                    {item.subItems && (
                      <span className="ml-2">
                        {openSubMenu === item.name ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </motion.div>
                </Link>
                {/* Render sub-items if the submenu is open */}
                {item.subItems && openSubMenu === item.name && (
                  <div className="ml-6">
                    {item.subItems.map((subItem) => (
                      <Link key={subItem.href} to={subItem.href}>
                        <motion.div
                          className={`flex items-center p-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-1 ${
                            location.pathname === subItem.href
                              ? "text-green-500"
                              : "text-white"
                          }`}
                        >
                          <AnimatePresence>
                            {isSidebarOpen && (
                              <motion.span
                                className="ml-2 whitespace-nowrap"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, delay: 0.3 }}
                              >
                                • {subItem.name}{" "}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
