import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateShipperInfo } from '../../redux/shipper/shipperSlice';
import { useUpdateShipperMutation } from '../../redux/shipper/shipperApi';

const UpdateInformation = () => {
  const [shipperData, setShipperData] = useState({
    yourname: '',
    address: '',
    phoneNumber: '',
    password: '',
    cccd: '',
    licensePlate: '',
    avatar: null,
    cccdFrontImage: null,
    cccdBackImage: null,
    licensePlateImage: null
  });

  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [updateShipperApi, { isLoading }] = useUpdateShipperMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipperData({ ...shipperData, [name]: value });

    if (name === 'phoneNumber') {
      setPhoneNumberError('');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setShipperData({ ...shipperData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate số điện thoại (nếu có nhập)
    const phoneNumberRegex = /^[0-9]{10}$/;
    if (shipperData.phoneNumber && !phoneNumberRegex.test(shipperData.phoneNumber)) {
      setPhoneNumberError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số.');
      return;
    }

    try {
      // Tạo FormData để gửi cả file và text
      const formData = new FormData();
      for (const key in shipperData) {
        if (shipperData[key] !== null && shipperData[key] !== undefined && shipperData[key] !== '') {
          formData.append(key, shipperData[key]);
        }
      }

      const response = await updateShipperApi(formData).unwrap();
      dispatch(updateShipperInfo(response.shipper));

      toast.success('Cập nhật thông tin thành công!', { 
        position: 'top-center',
        autoClose: 1500
      });
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);

    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.', { 
        position: 'top-center',
        autoClose: 1500
      });
    }
  };

  return (
    <div className="boxContainer pb-10">
      <form className="space-y-4 p-5 bg-gray-200 mt-4" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Avatar:</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            onChange={handleFileChange}
          />
        </div>

        {/* Mặt trước CCCD */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Mặt trước CCCD:</label>
          <input
            type="file"
            name="cccdFrontImage"
            accept="image/*"
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            onChange={handleFileChange}
          />
        </div>

        {/* Mặt sau CCCD */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Mặt sau CCCD:</label>
          <input
            type="file"
            name="cccdBackImage"
            accept="image/*"
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Ảnh biển số xe:</label>
          <input
            type="file"
            name="licensePlateImage"
            accept="image/*"
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Họ và tên:</label>
          <input
            type="text"
            name="yourname"
            value={shipperData.yourname}
            onChange={handleChange}
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            placeholder="Nhập họ và tên"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={shipperData.address}
            onChange={handleChange}
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            placeholder="Nhập địa chỉ"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Số điện thoại:</label>
          <div className="w-full md:w-2/6">
            <input
              type="text"
              name="phoneNumber"
              value={shipperData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-gray-100 p-2 rounded"
              placeholder="Nhập số điện thoại 10 số"
            />
            {phoneNumberError && (
              <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Số CCCD:</label>
          <input
            type="text"
            name="cccd"
            value={shipperData.cccd}
            onChange={handleChange}
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            placeholder="Nhập số CCCD"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-full md:w-1/6">Biển số xe:</label>
          <input
            type="text"
            name="licensePlate"
            value={shipperData.licensePlate}
            onChange={handleChange}
            className="w-full md:w-2/6 bg-gray-100 p-2 rounded"
            placeholder="Nhập biển số xe"
          />
        </div>

        {/* Nút submit */}
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className={`btn__seemore ${isSuccess ? 'bg-green-500' : ''}`}
            disabled={isLoading || isSuccess}
          >
            {isSuccess 
              ? '✓ Cập nhật thành công' 
              : isLoading 
                ? '⏳ Đang cập nhật...' 
                : 'Cập nhật thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInformation;