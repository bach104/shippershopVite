import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Shoppingcart from "./Shoppingcart";
import Auth from "./Auth";
const Navbar = () => {
  return (
    <header className="header z-20 bg-white">
      <nav className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <nav className="nav__logo">
          <Link className="transition" to="/">
            Shoponline
          </Link>
        </nav>
        <ul className="nav__links md:flex-none">
          <li>
            <Link className="hover:text-gray-400 transition" to="/">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/store">
              Cửa hàng
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/products">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/introduce">
              Giới thiệu
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <span>
            <Link className="hover:text-gray-400 transition" to="/products">
              <Search className="w-5 h-5 cursor-pointer" />
            </Link>
          </span>
          <span className="relative">
            <Shoppingcart />
          </span>
          <span className="relative">
             <Auth/>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
