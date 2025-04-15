import { configureStore } from "@reduxjs/toolkit";
import shipperReducer from "./shipper/shipperSlice";
import orderReducer from "./order/orderSlice"; // Import the new order slice
import { shipperApi } from "./shipper/shipperApi";
import { orderApi } from "./order/orderApi"; // Import the new order API
import { checkTokenExpiration } from "../redux/token/tokenUtils";
import { clearShipper } from "./shipper/shipperSlice";

const store = configureStore({
  reducer: {
    shipper: shipperReducer,
    shipperOrders: orderReducer, // Add the new order reducer
    [shipperApi.reducerPath]: shipperApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer, // Add the new order API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(shipperApi.middleware)
      .concat(orderApi.middleware), // Add the order API middleware
});

// Token expiration check
const initializeStore = () => {
  const state = store.getState();
  if (state.shipper.token && checkTokenExpiration(state.shipper.token)) {
    store.dispatch(clearShipper());
  }
};

initializeStore();

export default store;