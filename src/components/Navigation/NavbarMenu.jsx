import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faBars, faHandshakeSimple, faListCheck, faRightFromBracket, faRightToBracket, faTruckFast, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from "react-redux";
import { clearShipper } from "../../redux/shipper/shipperSlice";
import { useLogoutShipperMutation } from "../../redux/shipper/shipperApi";
import { toast } from "react-toastify";
import { checkTokenExpiration } from "../../redux/token/tokenUtils";

const NavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentShipper, token } = useSelector((state) => state.shipper);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutShipper] = useLogoutShipperMutation();
  const menuRef = useRef(null);

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

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Kiểm tra không phải click vào icon menu
        const menuIcon = document.querySelector('.mobile-menu-container .fa-bars');
        if (!(menuIcon && menuIcon.contains(event.target))) {
          setIsMenuOpen(false);
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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

  return (
    <nav className="mobile-menu-container" ref={menuRef}>
      <FontAwesomeIcon 
        className="text-2xl cursor-pointer hover:opacity-50 transition" 
        icon={faBars} 
        onClick={toggleMenu}
      />
      <ul className={`mobile-menu z-20 ${isMenuOpen ? 'open' : ''}`}>
        <li onClick={toggleMenu}>
          <Link className="menu-item gap-2" to="/nhan-don">
            <FontAwesomeIcon icon={faListCheck} />
            Nhận giao đơn
          </Link>
        </li>
        <li onClick={toggleMenu}>
          <Link className="menu-item gap-2" to="/dang-giao">
            <FontAwesomeIcon icon={faTruckFast} />
            Các đơn đang giao
          </Link>
        </li>
        <li onClick={toggleMenu}>
          <Link className="menu-item gap-2" to="/da-giao">
            <FontAwesomeIcon icon={faHandshakeSimple} />
            Đơn giao đến tay khách
          </Link>
        </li>
        <li onClick={toggleMenu}>
          <Link className="menu-item gap-2" to="/profile">
            <FontAwesomeIcon icon={faUser} />
            Thông tin cá nhân
          </Link>
        </li>
        {currentShipper ? (
          <li onClick={toggleMenu}>
            <button 
              className="menu-item gap-2 w-full text-left"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Đăng xuất
            </button>
          </li>
        ) : (
          <li onClick={toggleMenu}>
            <Link className="menu-item gap-2" to="/login">
              <FontAwesomeIcon icon={faRightToBracket} />
              Đăng nhập
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavbarMenu;