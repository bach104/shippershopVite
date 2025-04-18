import { useState } from "react";
import { useCreateOrderStatusShipperMutation } from "../../redux/order/orderApi";
import avatarImg from "../../assets/img/avatar.png";
import { getBaseUrl } from "../../utils/baseUrl";

const ManagerOrderInformation = ({ order, onClose }) => {
  const [updateOrderStatus] = useCreateOrderStatusShipperMutation();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showFailureReason, setShowFailureReason] = useState(false);
  const [images, setImages] = useState([]);
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleDeliverySuccess = async () => {
    if (images.length === 0) {
      setError("Vui lòng tải lên ít nhất một hình ảnh xác nhận");
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Convert images to base64
      const imagePromises = images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const response = await updateOrderStatus({
        orders: [{
          orderId: order._id,
          status: "đã giao đến tay khách hàng",
          images: base64Images,
          note: "Giao hàng thành công"
        }]
      }).unwrap();

      if (response.success) {
        onClose(); // Close the modal on success
      } else {
        setError(response.message || "Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Đã xảy ra lỗi");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveryFailure = async () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do giao hàng thất bại");
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      const response = await updateOrderStatus({
        orders: [{
          orderId: order._id,
          status: "giao hàng thất bại",
          note: note.trim()
        }]
      }).unwrap();

      if (response.success) {
        onClose(); // Close the modal on success
      } else {
        setError(response.message || "Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Đã xảy ra lỗi");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForms = () => {
    setShowImageUpload(false);
    setShowFailureReason(false);
    setImages([]);
    setNote("");
    setError(null);
  };

  return (
    <div className="max-width border border-black"> 
      <div className="bg-black opacity-70 font-bold flex justify-items-center justify-between">
        <h2 className="text-xl text-white p-4">Chi tiết đơn hàng {order.orderCode || `#${order._id.slice(-6).toUpperCase()}`}</h2>
        <p 
          onClick={() => {
            resetForms();
            onClose();
          }}
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
                <p><b>Tên khách hàng:</b> {order.customerInfo?.username || 'N/A'}</p>
                <p><b>Email:</b> {order.customerInfo?.email || 'N/A'}</p>
              </div>
              <div>
                <p><b>Số điện thoại:</b> {order.customerInfo?.phone || order.shippingInfo.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Image upload section */}
          {showImageUpload && (
            <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Xác nhận giao hàng thành công</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tải lên hình ảnh xác nhận (bắt buộc)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-black file:text-white
                    hover:file:bg-gray-700"
                />
                {images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Đã chọn {images.length} hình ảnh
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setError(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeliverySuccess}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isUpdating ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          )}

          {/* Delivery failure reason section */}
          {showFailureReason && (
            <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Ghi lại lý do giao hàng thất bại</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do (bắt buộc)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Nhập lý do giao hàng thất bại..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowFailureReason(false);
                    setError(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeliveryFailure}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isUpdating ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons - only show if not in image upload or failure reason mode */}
        {!showImageUpload && !showFailureReason && (
          <div className="flex justify-between p-4">
            <button 
              onClick={() => {
                setShowImageUpload(true);
                setShowFailureReason(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
            >
              Đã giao đến tay khách hàng
            </button>
            <div>
              <button 
                onClick={() => {
                  setShowFailureReason(true);
                  setShowImageUpload(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-4"
              >
                Giao hàng thất bại
              </button>
              <button 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  resetForms();
                  onClose();
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagerOrderInformation;