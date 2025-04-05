import { createSlice } from '@reduxjs/toolkit';
import { shipperApi } from './shipperApi';

const initialState = {
  shipper: null,
  token: localStorage.getItem('token') || null,
  error: null,
  isAuthenticated: false,
  loading: false
};

const shipperSlice = createSlice({
  name: 'shipper',
  initialState,
  reducers: {
    setShipperCredentials: (state, action) => {
      const { data, token } = action.payload;
      state.shipper = data;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', token);
    },
    shipperLogout: (state) => {
      state.shipper = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearShipperError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái loading cho các mutation
      .addMatcher(
        shipperApi.endpoints.registerShipper.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        shipperApi.endpoints.loginShipper.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        shipperApi.endpoints.logoutShipper.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      
      // Xử lý kết quả thành công
      .addMatcher(
        shipperApi.endpoints.registerShipper.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.shipper = action.payload.data;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        shipperApi.endpoints.loginShipper.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.shipper = action.payload.data;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        shipperApi.endpoints.logoutShipper.matchFulfilled,
        (state) => {
          state.loading = false;
          state.shipper = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      )
      .addMatcher(
        shipperApi.endpoints.getShipperProfile.matchFulfilled,
        (state, action) => {
          state.shipper = action.payload.data;
          state.isAuthenticated = true;
        }
      )
      
      // Xử lý lỗi
      .addMatcher(
        shipperApi.endpoints.registerShipper.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = {
            code: action.payload?.data?.code,
            message: action.payload?.data?.message
          };
        }
      )
      .addMatcher(
        shipperApi.endpoints.loginShipper.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = {
            code: action.payload?.data?.code,
            message: action.payload?.data?.message
          };
        }
      );
  }
});

export const { 
  setShipperCredentials,
  shipperLogout,
  clearShipperError
} = shipperSlice.actions;

export default shipperSlice.reducer;

// Selectors
export const selectCurrentShipper = (state) => state.shipper.shipper;
export const selectShipperToken = (state) => state.shipper.token;
export const selectShipperError = (state) => state.shipper.error;
export const selectIsShipperAuthenticated = (state) => state.shipper.isAuthenticated;
export const selectShipperLoading = (state) => state.shipper.loading;