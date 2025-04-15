import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterShipperMutation } from "../redux/shipper/shipperApi";
import { toast } from "react-toastify";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Register = () => {
  const navigate = useNavigate();
  const [registerShipper, { isLoading }] = useRegisterShipperMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, rePassword } = formData;
    const newErrors = {};

    if (!username) newErrors.username = "Vui lòng nhập tên đăng nhập.";
    if (!email) newErrors.email = "Vui lòng nhập email.";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu.";
    if (!rePassword) newErrors.rePassword = "Vui lòng nhập lại mật khẩu.";
    if (password && rePassword && password !== rePassword)
      newErrors.rePassword = "Mật khẩu nhập lại không khớp.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerShipper({ username, email, password }).unwrap();
      toast.success("Đăng ký thành công!");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message = err?.data?.message || "Đã có lỗi xảy ra.";
      const code = err?.data?.code;

      if (code === "USERNAME_EXISTS") {
        setErrors({ username: "Tên đăng nhập đã tồn tại" });
      } else if (code === "EMAIL_EXISTS") {
        setErrors({ email: "Email đã tồn tại" });
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="Auth">
      <div className="boxLog shadow-black m-3 pb-3 rounded-md">
        <h1 className="font-bold px-3 py-2 rounded-t-md">Đăng ký</h1>
        <form className="p-3 mt-2" onSubmit={handleSubmit}>
          <div className="form-control mb-3">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              className="p-2 rounded-md mt-2 w-full"
              type="text"
              name="username"
              id="username"
              placeholder="Tạo tên đăng nhập"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="email">Email:</label>
            <input
              className="p-2 rounded-md mt-2 w-full"
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="password">Tạo mật khẩu:</label>
            <div className="relative w-full">
              <input
                className="p-2 w-full rounded-md mt-2 pr-10"
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tạo mật khẩu"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`fa-regular absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="rePassword">Nhập lại mật khẩu:</label>
            <div className="relative w-full">
              <input
                className="p-2 w-full rounded-md mt-2 pr-10"
                name="rePassword"
                id="rePassword"
                type={showRePassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                value={formData.rePassword}
                onChange={handleChange}
              />
              <i
                className={`fa-regular absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer ${
                  showRePassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={toggleRePasswordVisibility}
              ></i>
            </div>
            {errors.rePassword && (
              <p className="text-red-500 text-sm mt-1">{errors.rePassword}</p>
            )}
          </div>

          {isSuccess ? (
            <button
              type="button"
              className="bg-black text-white px-3 py-2 rounded-md w-full mt-3"
              disabled
            >
              <FontAwesomeIcon className="mr-2 text-xl font-bold text-green-600" icon={faCheck} />
              Đăng ký thành công
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-3 py-2 rounded-md w-full mt-3"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          )}

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
          Bạn đã có tài khoản?{" "}
          <Link className="font-bold" to="/login">
            Đăng nhập
          </Link>{" "}
          để vào shop
        </p>
      </div>
    </div>
  );
};

export default Register;