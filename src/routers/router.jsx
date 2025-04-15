import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../Page/Home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../Page/informationAuth/Information";
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
            path: "/profile",
            element: <Profile />,
        },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);
export default router;