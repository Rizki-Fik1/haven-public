import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 flex items-center gap-3 min-w-[300px] border border-gray-200">
        <div className="flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
