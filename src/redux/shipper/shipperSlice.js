import { createSlice } from "@reduxjs/toolkit";

const loadShipperFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('shipperState');
    if (serializedState === null) {
      return {
        currentShipper: null,
        token: null,
        tokenExpiration: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load shipper state", err);
    return {
      currentShipper: null,
      token: null,
      tokenExpiration: null,
    };
  }
};

const initialState = loadShipperFromStorage();

const shipperSlice = createSlice({
  name: "shipper",
  initialState,
  reducers: {
    setShipper: (state, action) => {
      state.currentShipper = action.payload.shipper;
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.tokenExpiration;
      try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("shipperState", serializedState);
      } catch (err) {
        console.error("Could not save shipper state", err);
      }
    },
    updateShipperInfo: (state, action) => {
      if (state.currentShipper) {
        state.currentShipper = {
          ...state.currentShipper,
          ...action.payload,
        };
          const serializedState = JSON.stringify(state);
          localStorage.setItem("shipperState", serializedState);
  
      }
    },
    clearShipper: (state) => {
      state.currentShipper = null;
      state.token = null;
      state.tokenExpiration = null;
      try {
        localStorage.removeItem("shipperState");
      } catch (err) {
        console.error("Could not remove shipper state", err);
      }
    },
  },
});
export const { setShipper, updateShipperInfo, clearShipper } = shipperSlice.actions;
export default shipperSlice.reducer;