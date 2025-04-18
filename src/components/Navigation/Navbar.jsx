import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import Auth from "./Auth";
import NavbarMenu from "./NavbarMenu";
const Navbar = () => {
  return (
    <header className="header  w-full z-20 bg-white">
      <nav className=" mx-auto px-4 container-width flex items-center justify-between">
        <div className="flex navbar items-center gap-4">
            <NavbarMenu/>
          <nav className="nav__logo">
            <Link className="transition text-black" to="/">
              ShopVite
            </Link>
          </nav>
        </div>
        <ul className="nav__links md:flex-none">
          <li>
            <Link className="hover:text-gray-400 transition" to="/">
              Sản phẩm cần giao
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/delivery">
              Nhận giao
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <span>
            <Link className="hover:text-gray-400 transition" to="/products">
              <Search className="w-5 h-5 cursor-pointer" />
            </Link>
           
          </span>
          <span>
            <Auth />
          </span>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
