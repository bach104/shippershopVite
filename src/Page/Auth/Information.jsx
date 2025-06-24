import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShowInformation from "./ShowInformation";
import UpdateInformation from "./UpdateInformation";

const Information = () => {
  const { currentShipper } = useSelector((state) => state.shipper);
  const navigate = useNavigate();
  if (!currentShipper) {
    return (
      <div className="mt-20  flex justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Truy cập bị hạn chế
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem và cập nhật thông tin cá nhân.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate("/dang_nhap")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-blue-500 hover:text-blue-700 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-20 informationAuth container mx-auto px-4 pb-10">
      <ShowInformation />
      <div className="pt-5 boxContainer text-center font-bold mt-6">
        <h2 className="bg-gray-200 p-4 rounded-lg">
          Cập nhật thông tin cá nhân
        </h2>
      </div>
      <UpdateInformation />
    </div>
  );
};

export default Information;