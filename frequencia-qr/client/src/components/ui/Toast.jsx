import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const toast = useCallback(texto => {
    setMsg({ texto, id: Date.now() });
    setTimeout(() => setMsg(m => (m && Date.now() - m.id >= 3000 ? null : m)), 3100);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {msg && <div className="toast" role="status"><CheckCircle2 size={19} />{msg.texto}</div>}
    </ToastContext.Provider>
  );
}
