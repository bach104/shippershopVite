import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  shipperOrders: [],
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  isLoading: false,
  error: null,
  updateStatus: {
    isUpdating: false,
    successCount: 0,
    failedCount: 0,
    failedUpdates: [],
    message: null,
    updatedOrders: [],
    isProfileIncomplete: false,
    missingFields: null,
  },
  singleOrderUpdate: {
    isUpdating: false,
    data: null,
    message: null,
    error: null,
    isProfileIncomplete: false,
    missingFields: null,
  },
  filters: {
    username: '',
    paymentMethod: 'all',
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const orderSlice = createSlice({
  name: 'shipperOrders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalOrders = action.payload.totalOrders;
    },
    setShipperOrders: (state, action) => {
      state.shipperOrders = action.payload.orders;
      state.totalOrders = action.payload.count;
    },
    resetShipperOrders: () => initialState,
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    startStatusUpdate: (state) => {
      state.updateStatus.isUpdating = true;
      state.updateStatus.successCount = 0;
      state.updateStatus.failedCount = 0;
      state.updateStatus.failedUpdates = [];
      state.updateStatus.message = null;
      state.updateStatus.updatedOrders = [];
      state.updateStatus.isProfileIncomplete = false;
      state.updateStatus.missingFields = null;
    },
    statusUpdateSuccess: (state, action) => {
      state.updateStatus.isUpdating = false;
      state.updateStatus.successCount = action.payload.updatedCount;
      state.updateStatus.failedCount = action.payload.failedCount || 0;
      state.updateStatus.failedUpdates = action.payload.failedUpdates || [];
      state.updateStatus.message = action.payload.message;
      state.updateStatus.updatedOrders = action.payload.results || [];
      state.updateStatus.isProfileIncomplete = false;
      state.updateStatus.missingFields = null;
      
      if (action.payload.results?.length) {
        state.orders = state.orders.map(order => {
          const updatedOrder = action.payload.results.find(r => r.orderId === order._id);
          return updatedOrder ? { ...order, status: updatedOrder.status } : order;
        });
      }
    },
    statusUpdateFailed: (state, action) => {
      state.updateStatus.isUpdating = false;
      state.updateStatus.failedCount = action.payload.failedCount || 0;
      state.updateStatus.failedUpdates = action.payload.failedUpdates || [];
      state.updateStatus.message = action.payload.message;
      state.updateStatus.isProfileIncomplete = action.payload.isProfileIncomplete || false;
      state.updateStatus.missingFields = action.payload.missingFields || null;
      state.error = action.payload.message || 'Failed to update orders';
    },
    resetStatusUpdate: (state) => {
      state.updateStatus = initialState.updateStatus;
    },
    startSingleOrderUpdate: (state) => {
      state.singleOrderUpdate.isUpdating = true;
      state.singleOrderUpdate.data = null;
      state.singleOrderUpdate.message = null;
      state.singleOrderUpdate.error = null;
      state.singleOrderUpdate.isProfileIncomplete = false;
      state.singleOrderUpdate.missingFields = null;
    },
    singleOrderUpdateSuccess: (state, action) => {
      state.singleOrderUpdate.isUpdating = false;
      state.singleOrderUpdate.data = action.payload.data;
      state.singleOrderUpdate.message = action.payload.message;
      state.singleOrderUpdate.isProfileIncomplete = false;
      state.singleOrderUpdate.missingFields = null;
      
      if (action.payload.data?.order) {
        const orderIndex = state.orders.findIndex(o => o._id === action.payload.data.order._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = {
            ...state.orders[orderIndex],
            status: action.payload.data.order.status,
            images: action.payload.data.order.images || state.orders[orderIndex].images,
            note: action.payload.data.order.note || state.orders[orderIndex].note,
            updatedAt: action.payload.data.order.updatedAt
          };
        }
      }
      
      if (action.payload.data?.shipperOrder) {
        const shipperOrderIndex = state.shipperOrders.findIndex(
          o => o.orderId === action.payload.data.shipperOrder.orderId
        );
        
        if (shipperOrderIndex !== -1) {
          state.shipperOrders[shipperOrderIndex] = {
            ...state.shipperOrders[shipperOrderIndex],
            status: action.payload.data.shipperOrder.status,
            images: action.payload.data.shipperOrder.images || state.shipperOrders[shipperOrderIndex].images,
            note: action.payload.data.shipperOrder.note || state.shipperOrders[shipperOrderIndex].note,
            deliveryStartTime: action.payload.data.shipperOrder.deliveryStartTime || 
                            state.shipperOrders[shipperOrderIndex].deliveryStartTime,
            deliveryEndTime: action.payload.data.shipperOrder.deliveryEndTime || 
                          state.shipperOrders[shipperOrderIndex].deliveryEndTime
          };
        } else {
          state.shipperOrders.push(action.payload.data.shipperOrder);
        }
      }
    },
    singleOrderUpdateFailed: (state, action) => {
      state.singleOrderUpdate.isUpdating = false;
      state.singleOrderUpdate.error = action.payload.message;
      state.singleOrderUpdate.isProfileIncomplete = action.payload.isProfileIncomplete || false;
      state.singleOrderUpdate.missingFields = action.payload.missingFields || null;
      state.error = action.payload.message || 'Failed to update order';
    },
    resetSingleOrderUpdate: (state) => {
      state.singleOrderUpdate = initialState.singleOrderUpdate;
    },
  },
});

export const {
  setOrders,
  setShipperOrders,
  resetShipperOrders,
  setFilters,
  setPage,
  setSort,
  resetFilters,
  setLoading,
  setError,
  clearError,
  startStatusUpdate,
  statusUpdateSuccess,
  statusUpdateFailed,
  resetStatusUpdate,
  startSingleOrderUpdate,
  singleOrderUpdateSuccess,
  singleOrderUpdateFailed,
  resetSingleOrderUpdate,
} = orderSlice.actions;

export const selectAllOrders = (state) => state.shipperOrders.orders;
export const selectShipperOrders = (state) => state.shipperOrders.shipperOrders;
export const selectOrderFilters = (state) => state.shipperOrders.filters;
export const selectCurrentPage = (state) => state.shipperOrders.currentPage;
export const selectTotalPages = (state) => state.shipperOrders.totalPages;
export const selectTotalOrders = (state) => state.shipperOrders.totalOrders;
export const selectIsLoading = (state) => state.shipperOrders.isLoading;
export const selectError = (state) => state.shipperOrders.error;
export const selectUpdateStatus = (state) => state.shipperOrders.updateStatus;
export const selectSingleOrderUpdate = (state) => state.shipperOrders.singleOrderUpdate;
export const selectIsProfileIncomplete = (state) => 
  state.shipperOrders.updateStatus.isProfileIncomplete || 
  state.shipperOrders.singleOrderUpdate.isProfileIncomplete;
export const selectMissingFields = (state) => 
  state.shipperOrders.updateStatus.missingFields || 
  state.shipperOrders.singleOrderUpdate.missingFields;

export default orderSlice.reducer;