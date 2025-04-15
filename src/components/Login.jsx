import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginShipperMutation } from "../redux/shipper/shipperApi";
import { useDispatch } from "react-redux";
import { setShipper } from "../redux/shipper/shipperSlice";
import { toast } from "react-toastify";
import { getTokenExpiration } from "../redux/token/tokenUtils";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginShipper, { isLoading }] = useLoginShipperMutation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;
    const newErrors = {};

    if (!identifier) newErrors.identifier = "Vui lòng nhập email hoặc tên đăng nhập";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await loginShipper({ identifier, password }).unwrap();
      
      if (response.success) {
        const tokenExpiration = getTokenExpiration(response.token);
        
        dispatch(setShipper({
          shipper: response.shipper,
          token: response.token,
          tokenExpiration
        }));
        
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (err) {
      const message = err?.data?.message || "Đã có lỗi xảy ra";
      const code = err?.data?.code;

      if (code === "IDENTIFIER_NOT_FOUND") {
        setErrors({ identifier: "Tên đăng nhập hoặc email không tồn tại" });
      } else if (code === "INVALID_PASSWORD") {
        setErrors({ password: "Mật khẩu không đúng" });
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="Auth">
      <div className="boxLog shadow-black m-3 pb-3 rounded-md">
        <h1 className="font-bold px-3 py-2 rounded-t-md">Đăng nhập</h1>
        <form className="p-3 mt-2" onSubmit={handleSubmit}>
          <div className="form-control mb-3">
            <label htmlFor="identifier">Tên đăng nhập hoặc email:</label>
            <input
              className="p-2 rounded-md mt-2 w-full"
              type="text"
              name="identifier"
              id="identifier"
              placeholder="Nhập email hoặc tên đăng nhập"
              value={formData.identifier}
              onChange={handleChange}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="relative w-full">
              <input
                className="p-2 w-full rounded-md mt-2 pr-10"
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-black gap-2 text-white px-3 py-2 rounded-md w-full mt-3 flex justify-center items-center"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            {isLoading && <span className="loading loading-spinner loading-sm"></span>}
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