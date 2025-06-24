import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const STATUS_COLORS = {
  'đã giao cho bên vận chuyển': 'text-blue-600',
  'đang giao': 'text-yellow-600',
  'đã nhận được hàng': 'text-green-600',
  'giao hàng thất bại': 'text-red-600',
};

const OrderItem = ({ 
  order, 
  getProductImage, 
  onViewDetails, 
  showCheckbox = false, 
  isSelected = false, 
  onSelect = () => {},
  showDeliveryTimes = false
}) => {
  const firstProduct = order.items?.[0] || {};
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const totalProducts = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'N/A' 
        : date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return 'N/A';
    }
  };

  const status = order.shipperStatus || order.status;
  const orderCode = order.orderCode || `#${order._id?.slice(-6)?.toUpperCase() || 'N/A'}`;
  const customerName = order.shippingInfo?.yourname || order.shippingAddress?.yourname || 'N/A';
  const totalAmount = order.amountSummary?.totalAmount || order.totalAmount || 0;
  const createdAt = order.timestamps?.createdAt || order.createdAt;

  return (
    <div className={`Manager__display--product flex h-36 gap-4 justify-between p-2 mb-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="flex items-center">
        {firstProductImage ? (
          <img 
            src={firstProductImage}
            className="h-32 w-32 object-cover border border-gray-200 rounded"
            alt={firstProduct?.name || 'Ảnh sản phẩm'}
            onError={(e) => {
              e.target.src = "";
              e.target.className += " bg-gray-200";
            }}
          />
        ) : (
          <div className="h-32 w-32 border border-gray-200 bg-gray-100 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400 text-xl" />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-semibold">
          <span className="text-gray-600">Mã đơn:</span> {orderCode}
        </h3>
        <p className="text-sm">
          <span className="text-gray-600">Khách hàng:</span> {customerName}
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Ngày đặt:</span> {formatDateTime(createdAt)}
        </p>
        
        {showDeliveryTimes && order.deliveryStartTime && (
          <p className="text-sm">
            <span className="text-gray-600">Bắt đầu giao:</span> {formatDateTime(order.deliveryStartTime)}
          </p>
        )}
        
        {showDeliveryTimes && order.deliveryEndTime && (
          <p className="text-sm">
            <span className="text-gray-600">Hoàn thành:</span> {formatDateTime(order.deliveryEndTime)}
          </p>
        )}
        
        <p className="text-sm">
          <span className="text-gray-600">Tổng tiền:</span> {totalAmount.toLocaleString('vi-VN')}đ
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Số lượng:</span> {totalProducts} sản phẩm
        </p>
        <p>
          <span className="text-gray-600">Trạng thái:</span> 
          <span className={`ml-1 font-medium ${STATUS_COLORS[status] || STATUS_COLORS.default}`}>
            {status}
          </span>
        </p>
      </div>
      
      <div className="flex flex-col items-end h-full justify-between">
        {showCheckbox && (
          <input 
            type="checkbox" 
            checked={isSelected}
            className="w-5 h-5 cursor-pointer accent-blue-600"
            onChange={() => onSelect(order._id)}
          />
        )}
        <div className="flex items-end h-full">
          <button
            className={`bg-black ${showCheckbox ? 'hover:bg-gray-800' : 'opacity-60 hover:opacity-80'} transition text-white px-4 py-1 rounded-md`}
            onClick={() => onViewDetails(order)}
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  getProductImage: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  showCheckbox: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  showDeliveryTimes: PropTypes.bool
};

export default OrderItem;