import { useSelector } from "react-redux";
import avatarImg from "../../assets/img/avatar.png";
import { getBaseUrl } from "../../utils/baseUrl";
import { useEffect, useState } from "react";

const ShowInformation = () => {
  const { currentShipper } = useSelector((state) => state.shipper);
  const [shipperInfo, setShipperInfo] = useState(currentShipper);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false); // State để điều khiển hiển thị

  useEffect(() => {
    setShipperInfo(currentShipper);
  }, [currentShipper]);

  if (!shipperInfo) {
    return <div className="p-4">Loading...</div>;
  }

  const { 
    avatar, 
    yourname, 
    address, 
    phoneNumber, 
    email, 
    cccd, 
    licensePlate,
    cccdFrontImage,  
    cccdBackImage,    
    licensePlateImage  
  } = shipperInfo;
  
  const renderImage = (imagePath, altText) => {
    return imagePath ? (
      <img 
        src={`${getBaseUrl()}/uploads/${imagePath}`} 
        alt={altText}
        className="w-full h-96 object-contain border rounded bg-white"
        onError={(e) => {
          e.target.src = avatarImg;
          e.target.onerror = null;
        }}
      />
    ) : (
      <div className="w-full h-96 relative bg-gray-100 border rounded flex items-center justify-center">
        <p className="text-gray-500 text-lg">Chưa có hình ảnh</p>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-200 boxContainer p-4 text-center font-bold">
        <h2>Thông tin cá nhân</h2>
      </div>
      <div className="mt-5">
        <div className="mt-4 boxContainer grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col bg-gray-200 md:col-span-2 p-0 md:p-4">
            <div className="w-full md:w-auto md:flex md:flex-col md:items-center">
              {avatar ? (
                <img
                  src={`${getBaseUrl()}/uploads/${avatar}`}
                  alt="Avatar"
                  className="w-full h-48 object-cover rounded-none 
                            md:w-56 md:h-56 md:rounded-full md:object-cover"
                  onError={(e) => {
                    e.target.src = avatarImg;
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center
                              md:w-56 md:h-56 md:rounded-full">
                  <p className="text-gray-500">Chưa có avatar</p>
                </div>
              )}
              <p className="mt-2 font-medium p-4 md:p-0 text-center md:text-left">
                {yourname || "Tên của bạn"}
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-4 space-y-3">
            <p>
              <strong className="text-gray-700">Họ và tên:</strong>{" "}
              <span>{yourname || "Xin cập nhật"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Địa chỉ:</strong>{" "}
              <span>{address || "Xin cập nhật"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Số điện thoại:</strong>{" "}
              <span>{phoneNumber || "Xin cập nhật"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Email:</strong>{" "}
              <span>{email || "Xin cập nhật"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Số CCCD:</strong>{" "}
              <span>{cccd || "Xin cập nhật"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Biển số xe:</strong>{" "}
              <span>{licensePlate || "Xin cập nhật"}</span>
            </p>
            <button 
              className="btn__seemore"
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
            >
              {showAdditionalInfo ? "Ẩn thông tin" : "Xem thêm thông tin"}
            </button>
          </div>
        </div>

        {/* Phần thông tin ẩn/hiện */}
        {showAdditionalInfo && (
          <div className="mt-2 container-width bg-gray-200 min-h-[10px] w-full p-4 space-y-6 
              flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.666px)]">
              <h2 className="text-xl font-bold mb-2">Ảnh mặt trước CCCD</h2>
              {renderImage(cccdFrontImage, "Mặt trước CCCD")}
            </div>
            <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.666px)]">
              <h2 className="text-xl font-bold mb-2">Ảnh mặt sau CCCD</h2>
              {renderImage(cccdBackImage, "Mặt sau CCCD")}
            </div>
            <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.666px)]">
              <h2 className="text-xl font-bold mb-2">Ảnh biển số xe</h2>
              {renderImage(licensePlateImage, "Biển số xe")}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowInformation;