import { useState } from "react";
import { useUpdateShipperOrderMutation } from "../redux/order/orderApi";
import { toast } from 'react-toastify';
import OrderItemList from "../Page/base/cart/OrderItemList";
import { 
  DeliverySuccessForm, 
  DeliveryFailureForm, 
  ActionButtons 
} from "../Page/base/btn/FormOrderItem";

const ManagerOrderInformation = ({ order, onClose }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showFailureReason, setShowFailureReason] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [updateShipperOrder] = useUpdateShipperOrderMutation();

  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
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

  const handleDeliverySuccess = async (images) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await updateShipperOrder({
        orderId: order._id,
        status: 'đã nhận được hàng',
        images
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Xác nhận giao hàng thành công");
        onClose();
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Đã xảy ra lỗi khi cập nhật trạng thái");
      toast.error(err.data?.message || err.message || "Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveryFailure = async (note) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await updateShipperOrder({
        orderId: order._id,
        status: 'giao hàng thất bại',
        note
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Đã ghi nhận giao hàng thất bại");
        onClose();
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Đã xảy ra lỗi khi cập nhật trạng thái");
      toast.error(err.data?.message || err.message || "Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForms = () => {
    setShowImageUpload(false);
    setShowFailureReason(false);
    setError(null);
  };

  const isDelivered = order.status === 'đã nhận được hàng';
  const isFailed = order.status === 'giao hàng thất bại';
  const isShipped = order.status === 'đã giao cho bên vận chuyển';
  
  const showSuccessButton = isFailed || (!isDelivered && !isShipped);
  const showFailureButton = !isDelivered && !isFailed && !isShipped;

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
          <OrderItemList items={order.items} />
          
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
                <p><b>Tên khách hàng:</b> {order.shippingInfo.yourname || 'N/A'}</p>
                <p><b>Email:</b> {order.customerInfo?.email || 'N/A'}</p>
              </div>
              <div>
                <p><b>Số điện thoại:</b> {order.customerInfo?.phone || order.shippingInfo.phoneNumber}</p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {showImageUpload && !isDelivered && !isShipped && (
            <DeliverySuccessForm
              order={order}
              onCancel={() => {
                setShowImageUpload(false);
                setError(null);
              }}
              onSuccess={handleDeliverySuccess}
              isUpdating={isUpdating}
            />
          )}
          
          {showFailureReason && showFailureButton && (
            <DeliveryFailureForm
              onCancel={() => {
                setShowFailureReason(false);
                setError(null);
              }}
              onFailure={handleDeliveryFailure}
              isUpdating={isUpdating}
            />
          )}
        </div>
        
        {!showImageUpload && !showFailureReason && (
          <ActionButtons
            showSuccessButton={showSuccessButton}
            showFailureButton={showFailureButton}
            onShowSuccessForm={() => {
              setShowImageUpload(true);
              setShowFailureReason(false);
            }}
            onShowFailureForm={() => {
              setShowFailureReason(true);
              setShowImageUpload(false);
            }}
            onClose={() => {
              resetForms();
              onClose();
            }}
          />
        )}
      </section>
    </div>
  );
};

export default ManagerOrderInformation;