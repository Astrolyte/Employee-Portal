import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
function SideMenu({ activeMenu }) {
  const { clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = (path) => {
    if (path === "logout") {
      handleLogout();
      return;
    }
    navigate(path);
  };
  const handleLogout = async () => {
  try {
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {}, { withCredentials: true });
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    localStorage.clear();
    clearUser();
    navigate("/login");
  }
};
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-slate-50/80 border-r border-slate-200 backdrop-blur-md shadow-md p-5 sticky top-[61px] z-20">
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-sm py-3 px-5 rounded-full mb-3 cursor-pointer ${
            activeMenu === item.label ? "text-white bg-blue-500" : "text-gray-700 hover:bg-blue-100"
          } py-4 px-6 rounded-full mb-3`}
          onClick={() => handleClick(item.path)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default SideMenu;
