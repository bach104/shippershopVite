import { useGetOrdersByShipperQuery } from "../../redux/order/orderApi";
import { useState, useMemo, useCallback, useEffect } from "react";
import ManagerOrderInformation from "./manageInformation";
import { getBaseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { orderApi } from "../../redux/order/orderApi"; 
import { 
  resetShipperOrders
} from "../../redux/order/orderSlice";
import ShipperLoginPrompt from "../../components/ShipperLoginPrompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationCircle,
  faBoxOpen,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const ORDERS_PER_PAGE = 20;
const STATUS_COLORS = {
  'đang giao': 'text-blue-600',
  'đã giao đến tay khách hàng': 'text-green-600',
  'default': 'text-gray-600'
};

const Verifyofme = () => {
  const { currentShipper } = useSelector((state) => state.shipper);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetShipperOrders());
    dispatch(orderApi.util.resetApiState());
    setPage(1);
  }, [currentShipper?._id, dispatch]);

  const { 
    data: response = { success: true, orders: [] }, 
    isLoading, 
    isError, 
    error,
  } = useGetOrdersByShipperQuery(undefined, {
    skip: !currentShipper
  });
  
  const transformedOrders = useMemo(() => {
    if (!response?.success) return [];
    
    return response.orders
      .filter(item => item.status === 'đang giao') // Chỉ lấy đơn hàng có trạng thái "đang giao"
      .map(item => ({
        ...item.order,
        shipperStatus: item.status,
        deliveryStartTime: item.deliveryStartTime,
        deliveryEndTime: item.deliveryEndTime,
        shipperImages: item.images || [],
        shipperNote: item.note || "",
        shipperCreatedAt: item.createdAt,
        shipperOrderId: item._id,
        orderCode: item.order?.orderCode || `#${item.order?._id?.slice(-6)?.toUpperCase() || 'N/A'}`
      }));
  }, [response]);

  const { currentPageOrders, totalPages, showingFrom, showingTo } = useMemo(() => {
    const totalOrders = transformedOrders.length;
    const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    const startIndex = (page - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    
    return {
      currentPageOrders: transformedOrders.slice(startIndex, endIndex),
      totalPages,
      showingFrom: startIndex + 1,
      showingTo: Math.min(endIndex, totalOrders)
    };
  }, [page, transformedOrders]);

  const getProductImage = useCallback((image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  }, []);

  const handleViewDetails = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  if (!currentShipper) {
    return <ShipperLoginPrompt />;
  }

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
    <div className="container-width mt-20 mb-16">
      {/* Header section */}
      <div className="bg-black opacity-70 p-4 font-bold flex justify-between items-center">
        <h2 className="text-xl text-white">Các đơn hàng đang giao</h2>
        {transformedOrders.length > 0 && (
          <p className="text-white">
            Hiển thị {showingFrom}-{showingTo} trong tổng số {transformedOrders.length} đơn hàng
          </p>
        )}
      </div>
      
      <div className="Manager__display--Box">
        <div className="shoppingContainer relative">
          <section className="container-width p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="animate-spin text-blue-500 text-4xl mb-3" 
                />
                <p>Đang tải danh sách đơn hàng...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <FontAwesomeIcon 
                  icon={faExclamationCircle} 
                  className="text-red-500 text-4xl mb-3" 
                />
                <p className="text-red-500 font-medium">
                  {error?.data?.message || 'Có lỗi xảy ra khi tải đơn hàng'}
                </p>
              </div>
            ) : currentPageOrders.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon 
                  icon={faBoxOpen} 
                  className="text-gray-400 text-4xl mb-3" 
                />
                <h3 className="text-lg font-medium mb-1">Không có đơn hàng đang giao</h3>
                <p className="text-gray-600">Hiện tại không có đơn hàng nào đang trong trạng thái giao hàng</p>
              </div>
            ) : (
              currentPageOrders.map((order) => (
                <div 
                  key={order._id}
                  className="Manager__display--product flex h-36 gap-4 justify-between p-2 mb-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order details */}
                  <div className="flex items-center">
                    {order.items[0]?.image ? (
                      <img 
                        src={getProductImage(order.items[0].image)}
                        className="h-32 w-32 object-cover border border-gray-200 rounded"
                        alt={order.items[0]?.name || 'Ảnh sản phẩm'}
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
                      <span className="text-gray-600">Mã đơn:</span> {order.orderCode}
                    </h3>
                    <p className="text-sm">
                      <span className="text-gray-600">Khách hàng:</span> {order.shippingInfo?.yourname || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Ngày đặt:</span> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    {order.deliveryStartTime && (
                      <p className="text-sm">
                        <span className="text-gray-600">Bắt đầu giao:</span> {new Date(order.deliveryStartTime).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                    {order.deliveryEndTime && (
                      <p className="text-sm">
                        <span className="text-gray-600">Hoàn thành:</span> {new Date(order.deliveryEndTime).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="text-gray-600">Tổng tiền:</span> {order.totalAmount?.toLocaleString('vi-VN') || 0}đ
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Số lượng:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                    </p>
                    <p>
                      <span className="text-gray-600">Trạng thái:</span> 
                      <span className={`ml-1 font-medium ${STATUS_COLORS[order.shipperStatus] || STATUS_COLORS.default}`}>
                        {order.shipperStatus}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end h-full justify-between">
                    <div className="flex items-end h-full">
                      <button
                        className="bg-black opacity-60 cursor-pointer transition hover:opacity-80 px-4 py-1 rounded-md text-white"
                        onClick={() => handleViewDetails(order)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex h-14 bg-black opacity-70 justify-between  p-2 gap-2 items-center">
          <span className="text-white flex-1 text-center">
            Trang {page}/{totalPages}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Trang trước
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`bg-white font-bold shadow-md cursor-pointer px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
                page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
      </div>
  );
};

export default Verifyofme;