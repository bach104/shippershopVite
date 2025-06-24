
const SearchInput = ({ value, onChange, placeholder = "Tìm kiếm mã đơn hàng..." }) => {
  return (
    <input 
      type="text" 
      className="bg-white px-2 py-1 rounded-xl w-full max-w-xs" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;