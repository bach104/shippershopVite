import { useState } from "react";

export const DeliverySuccessForm = ({ 
  onCancel, 
  onSuccess, 
  isUpdating 
}) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      setError("Vui lòng tải lên ít nhất một hình ảnh xác nhận");
      return;
    }
    
    setError(null);
    onSuccess(images);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Xác nhận giao hàng thành công</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tải lên hình ảnh xác nhận (bắt buộc)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-black file:text-white
            hover:file:bg-gray-700"
        />
        {images.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Đã chọn {images.length} hình ảnh
          </p>
        )}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdating ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
};

export const DeliveryFailureForm = ({ 
  onCancel, 
  onFailure, 
  isUpdating 
}) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do giao hàng thất bại");
      return;
    }

    setError(null);
    onFailure(note);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Ghi lại lý do giao hàng thất bại</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lý do (bắt buộc)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          placeholder="Nhập lý do giao hàng thất bại..."
        />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUpdating ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
};

export const ActionButtons = ({
  showSuccessButton,
  showFailureButton,
  onShowSuccessForm,
  onShowFailureForm,
  onClose
}) => {
  return (
    <div className="flex p-4">
      <div className="flex w-full items-center">
        {showSuccessButton && (
          <button 
            onClick={onShowSuccessForm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
          >
            Đã giao đến tay khách hàng
          </button>
        )}
        {showFailureButton && (
          <button 
            onClick={onShowFailureForm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-4"
          >
            Giao hàng thất bại
          </button>
        )}
      </div>
      <div className="flex justify-end w-full">
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};