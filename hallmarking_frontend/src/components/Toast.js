import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext({
  notify: (_msg, _type) => {},
});

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to show toasts. Example: const { notify } = useToast(); notify("Saved", "success") */
  return useContext(ToastContext);
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides a simple toast system. */
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback((message, type = "error", timeout = 3500) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout) {
      setTimeout(() => remove(id), timeout);
    }
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite"
           aria-atomic="true"
           style={{
             position: "fixed",
             right: 16,
             bottom: 16,
             display: "flex",
             flexDirection: "column",
             gap: 8,
             zIndex: 1000,
           }}>
        {toasts.map((t) => (
          <div key={t.id}
               className={`status ${t.type === "error" ? "error" : ""}`}
               style={{ minWidth: 280, boxShadow: "0 10px 20px rgba(0,0,0,0.06)" }}
               role={t.type === "error" ? "alert" : "status"}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
