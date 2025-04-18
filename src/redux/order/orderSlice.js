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
    },
    statusUpdateSuccess: (state, action) => {
      state.updateStatus.isUpdating = false;
      state.updateStatus.successCount = action.payload.updatedCount;
      state.updateStatus.failedCount = action.payload.failedCount || 0;
      state.updateStatus.failedUpdates = action.payload.failedUpdates || [];
      state.updateStatus.message = action.payload.message;
    },
    statusUpdateFailed: (state, action) => {
      state.updateStatus.isUpdating = false;
      state.updateStatus.failedCount = action.payload.failedCount || 0;
      state.updateStatus.failedUpdates = action.payload.failedUpdates || [];
      state.updateStatus.message = action.payload.message;
      state.error = action.payload.message || 'Failed to update orders';
    },
    resetStatusUpdate: (state) => {
      state.updateStatus = initialState.updateStatus;
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

export default orderSlice.reducer;