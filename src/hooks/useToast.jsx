import { createContext, useContext, useState, useEffect } from 'react';

// Create a context to enable global access (optional)
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const toast = useProvideToast();
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <toast.Toast />
    </ToastContext.Provider>
  );
}

// Hook used inside ToastProvider or individually
export function useToast() {
  const context = useContext(ToastContext);
  return context || useProvideToast();
}

// Internal stateful hook
function useProvideToast(duration = 3000) {
  const [message, setMessage] = useState('');

  const showToast = (text) => {
    setMessage(text);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const Toast = () =>
    message ? (
      <div className="toast show position-fixed bottom-0 end-0 m-3 bg-dark text-white" role="alert">
        <div className="toast-body">{message}</div>
      </div>
    ) : null;

  return { showToast, Toast };
}
