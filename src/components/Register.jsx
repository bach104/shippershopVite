import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterShipperMutation } from "../redux/shipper/shipperApi";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [registerShipper, { isLoading }] = useRegisterShipperMutation();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: ""
  });
  
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "", rePassword: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
      isValid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Mật khẩu không trùng khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await registerShipper({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }).unwrap();

      if (response.success) {
        toast.success("Đăng ký shipper thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (error) {
      if (error.data) {
        // Handle shipper-specific errors
        if (error.data.code === 'SHIPPER_USERNAME_EXISTS') {
          setErrors(prev => ({
            ...prev,
            username: "Tên đăng nhập đã được sử dụng bởi shipper khác"
          }));
        } else if (error.data.code === 'SHIPPER_EMAIL_EXISTS') {
          setErrors(prev => ({
            ...prev,
            email: "Email đã được sử dụng bởi shipper khác"
          }));
        } else {
          toast.error(error.data.message || "Đăng ký thất bại");
        }
      } else {
        toast.error("Lỗi kết nối server. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Đăng ký Shipper</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nhập email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                id="rePassword"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.rePassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowRePassword(!showRePassword)}
              >
                {showRePassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {errors.rePassword && <p className="mt-1 text-sm text-red-600">{errors.rePassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black opacity-90 cursor-pointer text-white py-2 px-4 rounded-md hover:opacity-100 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký Shipper"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;