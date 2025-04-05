import { configureStore } from '@reduxjs/toolkit';
import { shipperApi } from './shipper/shipperApi';
import shipperReducer, { shipperLogout } from './shipper/shipperSlice';

function isShipperTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking shipper token expiration:', error);
    return true;
  }
}

const shipperTokenCheckMiddleware = store => next => action => {
  if (action.type === shipperLogout.type) {
    return next(action);
  }

  const state = store.getState();
  const token = state.shipper.token;
  
  if (token && isShipperTokenExpired(token)) {
    store.dispatch(shipperLogout());
    window.location.href = '/shipper/login?sessionExpired=true';
    return;
  }
  
  return next(action);
};

export default configureStore({
  reducer: {
    [shipperApi.reducerPath]: shipperApi.reducer,
    shipper: shipperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        shipperApi.middleware,
        shipperTokenCheckMiddleware
      ),
});