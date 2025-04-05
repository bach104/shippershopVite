import { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="Auth">
      <div className="boxLog shadow-black m-3 pb-3 rounded-md">
        <h1 className="font-bold px-3 py-2 rounded-t-md">Đăng nhập</h1>
        <form className="p-3 mt-2">
          <div className="form-control mb-3">
            <label htmlFor="usernameOrEmail">Tên đăng nhập hoặc email:</label>
            <input
              className="p-2 rounded-md mt-2 w-full"
              type="text"
              id="usernameOrEmail"
              placeholder="Nhập email hoặc tên đăng nhập"
            />
          </div>
          <div className="form-control mb-3">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="relative w-full">
              <input
                className="p-2 w-full rounded-md mt-2 pr-10"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <i className={`pt-2 fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="bg-black gap-2 text-white px-3 py-2 rounded-md w-full mt-3 flex justify-center items-center"
          >
            Đăng nhập
          </button>
          
          <button
            type="button"
            className="bg-black text-white px-3 py-2 rounded-md w-full mt-3 gap-2 flex items-center justify-center"
          >
            <span>
              <i className="fa-brands fa-google"></i>
            </span>
            Đăng nhập bằng Google
          </button>
        </form>
        <p className="p-3">
          Bạn chưa có tài khoản? Ấn{" "}
          <Link className="font-bold" to="/register">
            đăng ký
          </Link>{" "}
          để tạo tài khoản
        </p>
      </div>
    </div>
  );
};

export default Login;