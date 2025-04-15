import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import avatarImg from "../../assets/img/avatar.png";
import { useSelector, useDispatch } from "react-redux";
import { clearShipper } from "../../redux/shipper/shipperSlice";
import { useLogoutShipperMutation } from "../../redux/shipper/shipperApi";
import { toast } from "react-toastify";
import { checkTokenExpiration } from "../../redux/token/tokenUtils";
import { getBaseUrl } from "../../utils/baseUrl";

const Auth = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentShipper, token } = useSelector((state) => state.shipper);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutShipper] = useLogoutShipperMutation();

  const avatarUrl = currentShipper?.avatar
    ? `${getBaseUrl()}/uploads/${currentShipper.avatar}`
    : avatarImg;

  const handleAutoLogout = useCallback(async () => {
    try {
      await logoutShipper().unwrap();
      dispatch(clearShipper());
      toast.warning("Phiên đăng nhập đã hết hạn");
      navigate("/");
    } catch (err) {
      console.error('Auto logout error:', err);
    }
  }, [logoutShipper, dispatch, navigate]);

  useEffect(() => {
    const checkToken = () => {
      if (token && checkTokenExpiration(token)) {
        handleAutoLogout();
      }
    };

    const interval = setInterval(checkToken, 60000);
    checkToken();

    return () => clearInterval(interval);
  }, [token, handleAutoLogout]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logoutShipper().unwrap();
      dispatch(clearShipper());
      toast.success("Đăng xuất thành công");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Đăng xuất thất bại");
    }
  };

  const shipperDropDownMenus = [
    { label: "Thông tin cá nhân", path: "/profile" },
    { label: "Đơn hàng đã giao", path: "/orders" },
  ];

  return (
    <div className="relative">
      {currentShipper ? (
        <>
          <img
            className="size-7 rounded-full cursor-pointer"
            alt="Avatar"
            src={avatarUrl}
            onError={(e) => {
              e.target.src = avatarImg;
              e.target.onerror = null; // Ngăn loop lỗi
            }}
            onClick={toggleMenu}
          />
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50">
              {shipperDropDownMenus.map((menu, index) => (
                <Link
                  key={index}
                  to={menu.path}
                  className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {menu.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-4 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/login">
          <User className="w-5 h-5 cursor-pointer" />
        </Link>
      )}
    </div>
  );
};

export default Auth;