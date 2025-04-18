import { useGetAvailableOrdersQuery, useCreateOrderStatusShipperMutation } from "../../redux/order/orderApi";
import { useState, useMemo, useCallback } from "react";
import ManagerOrderInformation from "../informationOrder/manageInformation";
import { getBaseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { startStatusUpdate, statusUpdateSuccess, statusUpdateFailed } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";
import ShipperLoginPrompt from "../../components/ShipperLoginPrompt";

const ORDERS_PER_PAGE = 20;
const STATUS_COLORS = {
  'đã giao cho bên vận chuyển': 'text-blue-600',
  'default': 'text-gray-600'
};

const Home = () => {
  const { currentShipper } = useSelector((state) => state.shipper);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const dispatch = useDispatch();

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAvailableOrdersQuery({ page }, {
    skip: !currentShipper
  });
  
  const [updateOrderStatus] = useCreateOrderStatusShipperMutation();

  const availableOrders = useMemo(() => data?.orders || [], [data]);
  
  const pagination = useMemo(() => ({
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalOrders: data?.totalOrders || 0,
    ordersPerPage: data?.ordersPerPage || ORDERS_PER_PAGE
  }), [data]);

  const showingFrom = useMemo(() => (page - 1) * pagination.ordersPerPage + 1, [page, pagination]);
  const showingTo = useMemo(() => Math.min(
    page * pagination.ordersPerPage,
    pagination.totalOrders
  ), [page, pagination]);

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

  const toggleCheckboxes = useCallback(() => {
    setShowCheckboxes(prev => !prev);
    setSelectedOrders([]);
  }, []);

  const handleOrderSelect = useCallback((orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  }, []);

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
      toast.success(`Đã nhận ${response.updatedCount} đơn hàng để giao`);
      
      setSelectedOrders([]);
      setShowCheckboxes(false);
      refetch();
      
      if (response.failedCount > 0) {
        toast.warning(`${response.failedCount} đơn hàng nhận không thành công`);
      }
    } catch (error) {
      dispatch(statusUpdateFailed(error.data || error));
      toast.error(error.data?.message || 'Có lỗi khi nhận đơn hàng');
    }
  };

  if (!currentShipper) {
    return <ShipperLoginPrompt 
      title="Nhận đơn giao hàng"
      description="Hãy đăng nhập để xem và nhận các đơn hàng sẵn sàng giao"
    />;
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
    <div className="container-width mt-20 mb-4">
      <Header 
        title="Đơn hàng sẵn sàng giao"
        totalOrders={pagination.totalOrders}
        showingFrom={showingFrom}
        showingTo={showingTo}
        onToggleCheckboxes={toggleCheckboxes}
        showCheckboxes={showCheckboxes}
      />
      
      <OrderList 
        isLoading={isLoading}
        isError={isError}
        error={error}
        orders={availableOrders}
        showCheckboxes={showCheckboxes}
        selectedOrders={selectedOrders}
        onViewDetails={handleViewDetails}
        onOrderSelect={handleOrderSelect}
        getProductImage={getProductImage}
      />
      
      <Footer 
        showCheckboxes={showCheckboxes}
        selectedOrdersCount={selectedOrders.length}
        page={page}
        totalPages={pagination.totalPages}
        onConfirmOrders={handleConfirmOrders}
        onPageChange={handlePageChange}
        confirmButtonText="Nhận giao hàng"
      />
    </div>
  );
};

// Sub-components
const Header = ({ title, totalOrders, showingFrom, showingTo, onToggleCheckboxes, showCheckboxes }) => (
  <div className="bg-black opacity-70 p-4 font-bold flex justify-between items-center">
    <h2 className="text-xl text-white">{title}</h2>
    <div className="flex gap-4 items-center">
      {totalOrders > 0 && (
        <p className="text-white">
          Hiển thị {showingFrom}-{showingTo} trong tổng số {totalOrders} đơn hàng
        </p>
      )}
      <p 
        className={`cursor-pointer rounded-md transition ${
          showCheckboxes 
            ? 'text-white hover:opacity-80' 
            : 'text-white hover:opacity-80'
        }`}
        onClick={onToggleCheckboxes}
      >
        {showCheckboxes ? 'Hủy chọn' : 'Chọn đơn hàng'}
      </p>
    </div>
  </div>
);

const OrderList = ({
  isLoading,
  isError,
  error,
  orders,
  showCheckboxes,
  selectedOrders,
  onViewDetails,
  onOrderSelect,
  getProductImage
}) => (
  <div className="Manager__display--Box">
    <div className="shoppingContainer relative">
      <section className="container-width p-4">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState error={error} />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          orders.map((order) => (
            <OrderItem 
              key={order._id}
              order={order}
              getProductImage={getProductImage}
              onViewDetails={onViewDetails}
              showCheckbox={showCheckboxes}
              isSelected={selectedOrders.includes(order._id)}
              onSelect={onOrderSelect}
            />
          ))
        )}
      </section>
    </div>
  </div>
);

const Footer = ({
  showCheckboxes,
  selectedOrdersCount,
  page,
  totalPages,
  onConfirmOrders,
  onPageChange,
  confirmButtonText
}) => (
  <div className="flex h-14 bg-black opacity-70 justify-between p-2 gap-2 items-center">
    {showCheckboxes && selectedOrdersCount > 0 && (
      <button 
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md transition"
        onClick={onConfirmOrders}
      >
        {confirmButtonText} ({selectedOrdersCount} đơn)
      </button>
    )}
    
    <span className="text-white flex-1 text-center">
      Trang {page}/{totalPages}
    </span>
    
    {totalPages > 1 && (
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Trang trước
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`bg-white font-bold shadow-md cursor-pointer px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
            page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Trang sau
        </button>
      </div>
    )}
  </div>
);

const LoadingState = () => (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
    <p>Đang tải danh sách đơn hàng...</p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="text-center py-8">
    <p className="text-red-500 font-medium">
      {error?.data?.message || 'Có lỗi khi tải đơn hàng'}
    </p>
    <p className="text-gray-600 mt-1">Vui lòng thử lại sau</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium mb-1">Hiện không có đơn hàng nào sẵn sàng để nhận</h3>
    <p className="text-gray-600">Vui lòng kiểm tra lại sau</p>
  </div>
);

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
      <ProductImage 
        image={firstProductImage} 
        alt={firstProduct?.name} 
      />
      
      <OrderDetails 
        order={order}
        totalProducts={totalProducts}
        formatDateTime={formatDateTime}
      />
      
      <OrderActions 
        showCheckbox={showCheckbox}
        isSelected={isSelected}
        onSelect={() => onSelect(order._id)}
        onViewDetails={() => onViewDetails(order)}
      />
    </div>
  );
};

const ProductImage = ({ image, alt }) => (
  <div className="flex items-center">
    {image ? (
      <img 
        src={image}
        className="h-32 w-32 object-cover border border-gray-200 rounded"
        alt={alt || 'Ảnh sản phẩm'}
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
);

const OrderDetails = ({ order, totalProducts, formatDateTime }) => (
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
);
const OrderActions = ({ showCheckbox, isSelected, onSelect, onViewDetails }) => (
  <div className="flex flex-col items-end h-full justify-between">
    {showCheckbox && (
      <input 
        type="checkbox" 
        checked={isSelected}
        className="w-5 h-5 cursor-pointer accent-blue-600"
        onChange={onSelect}
      />
    )}
    <button
      className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-md"
      onClick={onViewDetails}
    >
      Chi tiết
    </button>
  </div>
);

export default Home;