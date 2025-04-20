import PropTypes from 'prop-types';

const STATUS_COLORS = {
  'đã giao cho bên vận chuyển': 'text-blue-600',
  'default': 'text-gray-600'
};

const OrderItem = ({ 
  order, 
  getProductImage, 
  onViewDetails, 
  showCheckbox, 
  isSelected, 
  onSelect 
}) => {
  const firstProduct = order.items[0];
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
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
            <span className="text-gray-400 text-xs text-center">Không có ảnh</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-semibold">
          <span className="text-gray-600">Mã đơn:</span> {order.orderCode || `#${order._id.slice(-6).toUpperCase()}`}
        </h3>
        <p className="text-sm">
          <span className="text-gray-600">Khách hàng:</span> {order.shippingInfo?.yourname || 'N/A'}
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Ngày đặt:</span> {formatDateTime(order.timestamps?.createdAt || order.createdAt)}
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Tổng tiền:</span> {order.amountSummary?.totalAmount?.toLocaleString('vi-VN') || order.totalAmount?.toLocaleString('vi-VN') || 0}đ
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Số lượng:</span> {totalProducts} sản phẩm
        </p>
        <p>
          <span className="text-gray-600">Trạng thái:</span> 
          <span className={`ml-1 font-medium ${
            STATUS_COLORS[order.status] || STATUS_COLORS.default
          }`}>
            {order.status}
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
        <div className="flex h-full items-end">
          <button
            className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-md"
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
  showCheckbox: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default OrderItem;