import { useGetAvailableOrdersQuery, useUpdateOrderStatusShipperMutation } from "../../redux/order/orderApi";
import { useState, useMemo } from "react";
import ManagerOrderInformation from "./manageInformation";
import { getBaseUrl } from "../../utils/baseUrl";
import { useDispatch } from "react-redux";
import { startStatusUpdate, statusUpdateSuccess, statusUpdateFailed } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";

const Home = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const dispatch = useDispatch();

  const { data, isLoading, isError, refetch } = useGetAvailableOrdersQuery({
    page,
  });
  const [updateOrderStatus] = useUpdateOrderStatusShipperMutation();

  const availableOrders = useMemo(() => {
    return data?.orders || [];
  }, [data]);

  const pagination = useMemo(() => {
    return {
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      totalOrders: data?.totalOrders || 0,
      ordersPerPage: data?.ordersPerPage || 20,
    };
  }, [data]);

  const getProductImage = (image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    if (!showCheckboxes) {
      setSelectedOrders([]);
    }
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleConfirmOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một đơn hàng");
      return;
    }

    try {
      dispatch(startStatusUpdate());
      
      const ordersToUpdate = availableOrders
        .filter(order => selectedOrders.includes(order._id))
        .map(order => ({
          orderId: order._id,
          status: 'đang giao'
        }));

      const response = await updateOrderStatus(ordersToUpdate).unwrap();
      
      dispatch(statusUpdateSuccess(response));
      toast.success(`Đã cập nhật trạng thái ${response.updatedCount} đơn hàng thành "đang giao"`);
      
      setSelectedOrders([]);
      setShowCheckboxes(false);
      refetch();
      
      if (response.failedCount > 0) {
        toast.warning(`${response.failedCount} đơn hàng cập nhật không thành công`);
      }
    } catch (error) {
      dispatch(statusUpdateFailed(error.data || error));
      toast.error(error.data?.message || 'Có lỗi khi cập nhật đơn hàng');
      console.error('Update error:', error);
    }
  };

  const showingFrom = (page - 1) * pagination.ordersPerPage + 1;
  const showingTo = Math.min(
    page * pagination.ordersPerPage,
    pagination.totalOrders
  );

  if (selectedOrder) {
    return (
      <div className="shoppingCart relative">
        <ManagerOrderInformation 
          order={selectedOrder} 
          onClose={handleCloseDetails}
        />
      </div>
    );
  }

  return (
    <div className="container-width mt-20 mb-4">
      <div className="bg-black opacity-70 p-4 font-bold flex justify-items-center justify-between">
        <h2 className="text-xl text-white ">Đơn hàng sẵn sàng hãy lựa chọn xác nhận để giao</h2>
        <div className="flex gap-4 items-center">
          {pagination.totalOrders > 0 && (
            <p className="text-white ">
              Hiển thị {showingFrom}-{showingTo} trong tổng số {pagination.totalOrders} đơn hàng
            </p>
          )}
          <p 
            className="text-white transition cursor-pointer font-bold hover:text-blue-500"
            onClick={toggleCheckboxes}
          >
            {showCheckboxes ? 'Hủy chọn' : 'Chọn'}
          </p>
        </div>
      </div>
      <div className="Manager__display--Box">
        <div className="shoppingContainer relative">
          <section className="container-width p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Đang tải đơn hàng...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Có lỗi khi tải đơn hàng</p>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="text-center py-8">
                <p>Hiện không có đơn hàng nào sẵn sàng để nhận.</p>
              </div>
            ) : (
              availableOrders.map((order) => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  getProductImage={getProductImage}
                  onViewDetails={handleViewDetails}
                  showCheckbox={showCheckboxes}
                  isSelected={selectedOrders.includes(order._id)}
                  onSelect={handleOrderSelect}
                />
              ))
            )}
          </section>
        </div>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex bg-black opacity-70 justify-between p-2 gap-2">
          {showCheckboxes && selectedOrders.length > 0 && (
            <button 
              className="bg-white cursor-pointer font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
              onClick={handleConfirmOrders}
            >
              Xác nhận giao hàng
            </button>
          )}
          <span className="flex items-center text-white">
            Trang {page}/{pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Trang trước
            </button>
           
            <button
              onClick={handleNextPage}
              disabled={page === pagination.totalPages}
              className={`bg-white font-bold shadow-md cursor-pointer px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
                page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Trang kế tiếp
            </button>
          </div>
        </div>
        )}
    </div>
  );
};

const OrderItem = ({ order, getProductImage, onViewDetails, showCheckbox, isSelected, onSelect }) => {
  const firstProduct = order.items[0];
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Xử lý hiển thị ngày đặt từ timestamps.createdAt
  const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Lỗi khi format ngày:', error);
      return 'N/A';
    }
  };

  const orderDate = formatOrderDate(order.timestamps?.createdAt);

  return (
    <div className="Manager__display--product flex h-36 gap-4 justify-between p-2 mb-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        {firstProductImage ? (
          <img 
            src={firstProductImage}
            className="h-32 w-32 object-cover border border-black rounded-s"
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
          <span className="text-gray-600">Ngày đặt:</span> {orderDate}
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
            order.status === 'đã giao cho bên vận chuyển' ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {order.status}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-end h-full">
        {showCheckbox && (
          <input 
            type="checkbox" 
            checked={isSelected}
            className="w-5 h-5 cursor-pointer"
            onChange={() => onSelect(order._id)}
          />
        )}
        <div className="flex items-end h-full">
          <button
            className="flex cursor-pointer bg-black opacity-80 hover:opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
            onClick={() => onViewDetails(order)}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;