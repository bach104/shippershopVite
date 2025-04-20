import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ProfileUpdateModal = ({ 
  isOpen, 
  onClose, 
  errorMessage, 
  missingFields, 
  onUpdateProfile 
}) => {
  if (!isOpen) return null;

  const fieldNames = {
    yourname: 'Họ và tên',
    address: 'Địa chỉ',
    phoneNumber: 'Số điện thoại',
    cccd: 'Số CCCD',
    licensePlate: 'Biển số xe',
    cccdFrontImage: 'Ảnh mặt trước CCCD',
    cccdBackImage: 'Ảnh mặt sau CCCD',
    licensePlateImage: 'Ảnh biển số xe'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-black">
        <div className="flex items-start mb-4">
          <FontAwesomeIcon 
            icon={faExclamationCircle} 
            className="text-yellow-500 text-2xl mr-3 mt-1" 
          />
          <div>
            <h3 className="text-xl font-bold">Thông tin cần cập nhật</h3>
            <p className="text-gray-600 mt-1">{errorMessage}</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi nhận đơn hàng:
          </p>
          <ul className="list-disc pl-5 mt-2 text-yellow-700">
            {missingFields.map(field => (
              <li key={field}>{fieldNames[field] || field}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Để sau
          </button>
          <button
            onClick={onUpdateProfile}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center"
          >
            Cập nhật ngay
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

ProfileUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  missingFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdateProfile: PropTypes.func.isRequired
};

export default ProfileUpdateModal;