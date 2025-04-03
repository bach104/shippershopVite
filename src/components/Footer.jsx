import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="w-full bg-dark text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4">Thông tin liên hệ</h4>
            <p className="flex items-center pb-3">
              <i className="fa-solid fa-phone mr-3 text-lg"></i> 0334.990.877
            </p>
            <p className="flex items-center pb-3">
              <i className="ri-map-pin-fill mr-3 text-lg"></i> 97 Đình Thôn, Mỹ Đình 1, Hà Nội
            </p>
            <p className="flex items-center pb-3">
              <i className="ri-link mr-3 text-lg"></i> Shoponline.com.vn
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Trang cá nhân shop</h4>
            <p className="flex items-center pb-3">
              <i className="ri-facebook-box-fill mr-3 text-lg"></i> Shoponline.fb.com
            </p>
            <p className="flex items-center pb-3">
              <i className="ri-instagram-fill mr-3 text-lg"></i> Shoponline.ig.com
            </p>
            <p className="flex items-center pb-3">
              <i className="fa-brands fa-tiktok mr-3 text-lg"></i> Shoponline.tiktok.com.vn
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-4">Tìm hiểu thêm</h4>
            <p className="pb-3">
              <Link to="/introduce" className="hover:text-gray-400">Giới thiệu về shop</Link>
            </p>
            <p className="pb-3">
              <Link to="/search" className="hover:text-gray-400">Tìm kiếm sản phẩm</Link>
            </p>
            <p className="pb-3">Thanh toán bằng QR Code</p>
          </div>
        </div>

        <div className="text-center mt-10 border-t border-gray-400 pt-6">
          <p>&copy; 2025 ShopOnline. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
