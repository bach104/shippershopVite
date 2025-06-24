import { useState, useMemo, useCallback } from "react";
import { useGetAvailableOrdersQuery, useCreateOrderStatusShipperMutation } from "../../redux/order/orderApi";
import ManagerOrderInformation from "../../hooks/manageInformation";
import { getBaseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { startStatusUpdate, statusUpdateSuccess, statusUpdateFailed } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";
import ShipperLoginPrompt from "../../hooks/ShipperLoginPrompt";
import { useNavigate } from "react-router-dom";
import OrderItem from "../base/cart/OrderItem";
import ProfileUpdateModal from "../../hooks/ProfileUpdateModal";
import Pagination from "../base/common/Pagination";
import SearchInput from "../base/common/SearchInput";

const ORDERS_PER_PAGE = 20;

const Home = () => {
  const navigate = useNavigate();
  const { currentShipper } = useSelector((state) => state.shipper);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
  
  const [updateOrderStatus, { isLoading: isUpdating }] = useCreateOrderStatusShipperMutation();
  
  const availableOrders = useMemo(() => data?.orders || [], [data]);
  
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return availableOrders;
    const term = searchTerm.toLowerCase();
    return availableOrders.filter(order => 
      order.orderCode?.toLowerCase().includes(term) || 
      `#${order._id?.slice(-6)?.toUpperCase()}`.includes(term)
    );
  }, [availableOrders, searchTerm]);

  const pagination = useMemo(() => ({
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalOrders: data?.totalOrders || 0,
    ordersPerPage: data?.ordersPerPage || ORDERS_PER_PAGE
  }), [data]);

  const getProductImage = useCallback((image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  }, []);

  const checkShipperProfileComplete = useCallback(() => {
    const requiredFields = [
      'yourname', 'address', 'phoneNumber', 'cccd', 
      'licensePlate', 'cccdFrontImage', 'cccdBackImage', 'licensePlateImage'
    ];
    const missingFields = requiredFields.filter(field => !currentShipper[field]);
    
    if (missingFields.length > 0) {
      setErrorMessage('Vui lòng cập nhật đầy đủ thông tin shipper trước khi nhận đơn hàng');
      setMissingFields(missingFields);
      setShowProfileUpdateModal(true);
      return false;
    }
    return true;
  }, [currentShipper]);

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

  const handleUpdateProfile = useCallback(() => {
    setShowProfileUpdateModal(false);
    navigate('/thong_tin');
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleConfirmOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một đơn hàng");
      return;
    }

    if (!checkShipperProfileComplete()) {
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
      const errorData = error.data?.data || error.data || error;
      toast.error(errorData.message || 'Có lỗi khi nhận đơn hàng');
      dispatch(statusUpdateFailed(errorData));
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
      <div className="bg-black text-line-one opacity-70 p-4 font-bold flex justify-between items-center">
        <h2 className="text-xl text-white">Sản phẩm cần giao</h2>
        <div className="flex justify-end gap-4 w-1/2 items-center">
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <p 
            className={`cursor-pointer rounded-md transition ${
            showCheckboxes 
                ? 'text-white hover:opacity-80' 
                : 'text-white hover:opacity-80'
            }`}
            onClick={toggleCheckboxes}
          >
            {showCheckboxes ? 'Hủy chọn' : 'Chọn đơn'}
          </p>
        </div>
      </div>
      <div className="Manager__display--Box">
        <div className="shoppingContainer relative">
          <section className="container-width p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p>Đang tải danh sách đơn hàng...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium">
                  {error?.data?.message || 'Có lỗi khi tải đơn hàng'}
                </p>
                <p className="text-gray-600 mt-1">Vui lòng thử lại sau</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-1">
                  {searchTerm ? 'Không tìm thấy đơn hàng phù hợp' : 'Hiện không có đơn hàng nào sẵn sàng để nhận'}
                </h3>
                <p className="text-gray-600">Vui lòng kiểm tra lại sau</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
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
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        showFromTo={false}
        className={showCheckboxes && selectedOrders.length > 0 ? 'justify-between' : 'justify-end'}
      >
        {showCheckboxes && selectedOrders.length > 0 && (
          <button 
            className={`bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md transition ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleConfirmOrders}
            disabled={isUpdating}
          >
            {isUpdating ? "ĐANG XỬ LÝ..." : "NHẬN GIAO HÀNG"} ({selectedOrders.length} đơn)
          </button>
        )}
      </Pagination>
      <ProfileUpdateModal 
        isOpen={showProfileUpdateModal}
        onClose={() => setShowProfileUpdateModal(false)}
        errorMessage={errorMessage}
        missingFields={missingFields}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};

export default Home;