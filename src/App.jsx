import { Outlet } from "react-router";
import Navbar from "./components/Navigation/Navbar";
import Footer from './components/Footer'
import "./sass/index.scss";
import './App.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearShipper } from './redux/shipper/shipperSlice';
import { checkTokenExpiration } from './redux/token/tokenUtils';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.shipper);

  useEffect(() => {
    if (token && checkTokenExpiration(token)) {
      dispatch(clearShipper());
    }
  }, [token, dispatch]);
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
}