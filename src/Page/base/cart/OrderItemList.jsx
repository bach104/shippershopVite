import avatarImg from "../../../assets/img/avatar.png";
import { getBaseUrl } from "../../../utils/baseUrl";

const OrderItemList = ({ items }) => {
  const getProductImage = (image) => {
    if (!image) return avatarImg;
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="Manager__display--product gap-4 h-36 justify-between p-2">
          <img 
            src={getProductImage(item.image)} 
            className="h-32 w-32 object-cover border border-black rounded-s" 
            alt={item.name}
            onError={(e) => {
              e.target.src = avatarImg;
            }}
          />
          <div className="flex-1 shoppingItems__technology">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm">
              <b>Giá:</b> {(item.price * item.quantity).toLocaleString('vi-VN')}đ
            </p>
            <p className="text-sm">
              <b>Số lượng:</b> {item.quantity}
            </p>
            {item.size && <p className="text-sm"><b>Size:</b> {item.size}</p>}
            {item.color && <p className="text-sm"><b>Màu:</b> {item.color}</p>}
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderItemList;