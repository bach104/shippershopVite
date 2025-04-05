import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <header className="header  w-full z-20 bg-white">
      <nav className=" mx-auto px-4 container-width flex items-center justify-between">
        <nav className="nav__logo">
          <Link className="transition text-black" to="/">
            Shoponline
          </Link>
        </nav>
        <ul className="nav__links md:flex-none">
          <li>
            <Link className="hover:text-gray-400 transition" to="/">
              Sản phẩm cần giao
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/store">
              Đã giao đến tay khách hàng
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
             <Link to="/login">
                  <User className="w-5 h-5 cursor-pointer" />
              </Link>
          </span>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
