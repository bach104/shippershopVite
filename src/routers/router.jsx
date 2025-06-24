import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../Page/Home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../Page/Auth/Information";
import Verifyofme from "../Page/Home/verifyofme"
import VerifySuccess from "../Page/Home/verifySuccess"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element:<Home/>
        },
        {
            path: "/thong_tin",
            element: <Profile />,
        },
        {
            path: "/nhan_giao",
            element: <Verifyofme/>,
        },
        {
            path: "/don_hang_da_giao",
            element: <VerifySuccess/>,
        },
    ],

    },
    {
        path: "/dang_nhap",
        element: <Login />,
    },
    {
        path: "/dang_ki",
        element: <Register />,
    },
]);
export default router;