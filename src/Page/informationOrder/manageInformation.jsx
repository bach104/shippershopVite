import avatarImg from "../../assets/img/avatar.png";
import { getBaseUrl } from "../../utils/baseUrl";

const ManagerOrderInformation = ({ order, onClose }) => {
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const getProductImage = (image) => {
    if (!image) return avatarImg;
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="max-width border border-black"> 
      <div className="bg-black opacity-70 font-bold flex justify-items-center justify-between">
        <h2 className="text-xl text-white p-4">Chi tiết đơn hàng {order.orderCode || `#${order._id.slice(-6).toUpperCase()}`}</h2>
        <p 
          onClick={onClose}
          className="text-white p-4 hover:text-blue-500 cursor-pointer"
        >
          Quay lại
        </p>
      </div>
      <section className="bg-white flex flex-col Manager__display--Box justify-between">
        <div className="space-y-4 p-4">
          {order.items.map((item, index) => (
            <div key={index} className="Manager__display--product gap-4 h-36 justify-between p-2">
              <img 
                src={getProductImage(item.image)} 
                className="h-32 w-32 object-cover border border-black rounded-s" 
                alt={item.name}
                onError={(e) => (e.target.src = avatarImg)}
              />
              <div className="flex-1 shoppingItems__technology">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm">
                  <b>Giá:</b> {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-sm">
                  <b>Số lượng:</b> {item.quantity}
                </p>
                {item.size && <p className="text-sm"><b>Size:</b> {item.size}</p>}
                {item.color && <p className="text-sm"><b>Màu:</b> {item.color}</p>}
              </div>
            </div>
          ))}
          
          <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="flex justify-between">
                  <span>Tạm tính ({totalProducts} sản phẩm):</span>
                  <span>{(order.amountSummary?.subtotal || order.subtotal).toLocaleString('vi-VN')}đ</span>
                </p>
                <p className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{(order.amountSummary?.shippingFee || order.shippingFee).toLocaleString('vi-VN')}đ</span>
                </p>
                <p className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{(order.amountSummary?.totalAmount || order.totalAmount).toLocaleString('vi-VN')}đ</span>
                </p>
              </div>
              <div>
                <p><b>Phương thức thanh toán:</b> {order.paymentMethod}</p>
                <p><b>Trạng thái:</b> <span className="font-semibold text-blue-500">{order.status}</span></p>
                <p><b>Ngày đặt hàng:</b> {formatDate(order.timestamps?.createdAt || order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><b>Người nhận:</b> {order.shippingInfo.yourname}</p>
                <p><b>Số điện thoại:</b> {order.shippingInfo.phoneNumber}</p>
              </div>
              <div>
                <p><b>Địa chỉ nhận hàng:</b></p>
                <p>{order.shippingInfo.address}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><b>Tên khách hàng:</b> {order.shippingInfo.yourname}</p>
                <p><b>Email:</b> {order.customerInfo.email || 'N/A'}</p>
              </div>
              <div>
                <p><b>Số điện thoại:</b> {order.customerInfo?.phone || order.shippingInfo.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4">
          <button 
            className="bg-black cursor-pointer transition hover:opacity-80 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </section>
    </div>
  );
};

export default ManagerOrderInformation;