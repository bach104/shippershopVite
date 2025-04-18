import { configureStore } from "@reduxjs/toolkit";
import shipperReducer from "./shipper/shipperSlice";
import orderReducer from "./order/orderSlice";
import { shipperApi } from "./shipper/shipperApi";
import { orderApi } from "./order/orderApi"; 
import { checkTokenExpiration } from "../redux/token/tokenUtils";
import { clearShipper } from "./shipper/shipperSlice";

const store = configureStore({
  reducer: {
    shipper: shipperReducer,
    shipperOrders: orderReducer, 
    [shipperApi.reducerPath]: shipperApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(shipperApi.middleware)
      .concat(orderApi.middleware),
});
const initializeStore = () => {
  const state = store.getState();
  if (state.shipper.token && checkTokenExpiration(state.shipper.token)) {
    store.dispatch(clearShipper());
  }
};

initializeStore();

export default store;