import { Outlet } from "react-router";
import Navbar from "./components/navbar/Navbar";
import Footer from './components/Footer'
import "./sass/index.scss";
import './App.css'

export default function Dashboard() {
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
}
