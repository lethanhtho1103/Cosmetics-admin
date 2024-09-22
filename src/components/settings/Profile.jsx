import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../axios";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { logOutAdminSuccess } from "../../redux/authSlice";

const Profile = () => {
  const currentAdmin = useSelector((state) => state.auth.login?.currentAdmin);
  const accessToken = useSelector(
    (state) => state.auth.login?.accessToken_admin
  );
  const id = currentAdmin?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      if (accessToken) {
        authService.logOut(dispatch, id, navigate, accessToken);
      } else {
        dispatch(logOutAdminSuccess());
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SettingSection icon={User} title={"Tài khoản cá nhân"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src={`${baseUrl}/${currentAdmin?.avatar}`}
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {currentAdmin?.username}
          </h3>
          <p className="text-gray-400">{currentAdmin?.email}</p>
        </div>
      </div>

      <div className="flex align-center justify-end">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-3">
          Chỉnh sửa
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </SettingSection>
  );
};
export default Profile;
