import PropTypes from 'prop-types';
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageInfo = true,
  showFromTo = false,
  showingFrom = 0,
  showingTo = 0,
  totalItems = 0,
  className = '',
  prevLabel = 'Trang trước',
  nextLabel = 'Trang sau',
  children
}) => {
  if (totalPages <= 1 && !children) return null;

  return (
    <div className={`flex h-14 bg-black opacity-70 p-2 gap-2 items-center ${className}`}>
      <div className="flex-1 flex items-center">
        {children}
      </div>
      {showPageInfo && (
        <div className="flex-1 text-center">
          <span className="text-white">
            {showFromTo && totalItems > 0 ? (
              `Hiển thị ${showingFrom}-${showingTo} trong tổng số ${totalItems}`
            ) : (
              `Trang ${currentPage}/${totalPages}`
            )}
          </span>
        </div>
      )}
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex-1 flex justify-end gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {prevLabel}
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageInfo: PropTypes.bool,
  showFromTo: PropTypes.bool,
  showingFrom: PropTypes.number,
  showingTo: PropTypes.number,
  totalItems: PropTypes.number,
  className: PropTypes.string,
  prevLabel: PropTypes.string,
  nextLabel: PropTypes.string,
  children: PropTypes.node
};

export default Pagination;