import { useGetOrdersByShipperQuery } from "../../redux/order/orderApi";
import { useState, useMemo, useCallback, useEffect } from "react";
import ManagerOrderInformation from "../../hooks/manageInformation";
import { getBaseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { orderApi } from "../../redux/order/orderApi"; 
import { resetShipperOrders } from "../../redux/order/orderSlice";
import ShipperLoginPrompt from "../../hooks/ShipperLoginPrompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faBoxOpen, faSpinner } from '@fortawesome/free-solid-svg-icons';
import OrderItem from "../base/cart/OrderItem";
import Pagination from "../base/common/Pagination";
import SearchInput from "../base/common/SearchInput";

const ORDERS_PER_PAGE = 20;

const Verifyofme = () => {
  const { currentShipper } = useSelector((state) => state.shipper);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      .filter(item => item.status === 'đang giao' || item.status === 'giao hàng thất bại')
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

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return transformedOrders;
    const term = searchTerm.toLowerCase();
    return transformedOrders.filter(order => 
      order.orderCode.toLowerCase().includes(term)
    );
  }, [transformedOrders, searchTerm]);

  const { currentPageOrders, totalPages } = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    const startIndex = (page - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    
    return {
      currentPageOrders: filteredOrders.slice(startIndex, endIndex),
      totalPages,
    };
  }, [page, filteredOrders]);

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

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
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
      <div className="bg-black opacity-70 p-4 font-bold flex justify-between items-center">
        <h2 className="text-xl text-white">Nhận giao</h2>
        <SearchInput 
          value={searchTerm}
          onChange={handleSearchChange}
        />
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
                <h3 className="text-lg font-medium mb-1">Không có đơn hàng</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Không tìm thấy đơn hàng phù hợp' 
                    : 'Hiện tại không có đơn hàng nào đang giao hoặc giao thất bại'}
                </p>
              </div>
            ) : (
              currentPageOrders.map((order) => (
                <OrderItem
                  key={order._id}
                  order={order}
                  getProductImage={getProductImage}
                  onViewDetails={handleViewDetails}
                  showDeliveryTimes={true}
                />
              ))
            )}
          </section>
        </div>
      </div>
      
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Verifyofme;