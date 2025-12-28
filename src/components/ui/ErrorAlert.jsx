import { AlertCircle, RefreshCw, X } from 'lucide-react';

const ErrorAlert = ({ 
  message = 'Terjadi kesalahan saat memuat data',
  onRetry,
  onClose,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200',
          icon: 'text-amber-600',
          text: 'text-amber-800',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`relative border rounded-xl p-4 ${styles.container} animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
        
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>
            {message}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${styles.button}`}
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors ${styles.icon}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
