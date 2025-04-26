import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandshakeSimple, 
  faListCheck, 
  faRightToBracket, 
  faTruckFast, 
  faUser,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const FeatureCard = ({ icon, color, title, description }) => (
  <div className="p-4 border rounded-lg hover:bg-gray-50 transition h-full">
    <div className="flex items-center gap-3 mb-2">
      <FontAwesomeIcon icon={icon} className={`${color} text-xl`} />
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 pl-9">{description}</p>
  </div>
);
const ShipperLoginPrompt = () => {
  return (
    <div className="container-width mx-auto p-6 bg-white rounded-lg shadow-md mt-28 mb-20">
      <div className="flex items-center gap-3 mb-4 p-3 bg-yellow-100 rounded-lg">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-600 text-xl" />
        <span className="font-medium">Bạn cần đăng nhập để truy cập tính năng này</span>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">Quản lý đơn hàng shipper</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faRightToBracket} className="text-blue-500 text-xl" />
            <span className="text-lg">Đăng nhập hệ thống</span>
          </div>
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Đăng nhập ngay
          </Link>
        </div>
        <h3 className="text-lg font-semibold mt-8 mb-3 border-b pb-2">Các tính năng chính:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={faListCheck}
            color="text-green-500"
            title="Đơn hàng đã nhận"
            description="Xem các đơn hàng bạn đã nhận giao"
          />
          <FeatureCard 
            icon={faTruckFast}
            color="text-yellow-500"
            title="Đơn đang giao"
            description="Theo dõi các đơn hàng đang trong quá trình giao"
          />
          <FeatureCard 
            icon={faHandshakeSimple}
            color="text-purple-500"
            title="Xác nhận giao hàng"
            description="Cập nhật trạng thái đơn hàng đã giao thành công"
          />
          <FeatureCard 
            icon={faUser}
            color="text-blue-500"
            title="Thông tin cá nhân"
            description="Quản lý thông tin tài khoản shipper"
          />
        </div>
      </div>
    </div>
  );
};
export default ShipperLoginPrompt;