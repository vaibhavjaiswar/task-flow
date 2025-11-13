"use client";

import Toast from "@/components/toast";
import { generateRandomString } from "@/utils";
import { createContext, ReactNode, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface ToastType {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: Omit<ToastType, "id">) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType>({
  showToast: ({ message }: Omit<ToastType, "id">) =>
    console.log("Toast message:", message),
});

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = ({ message }: Omit<ToastType, "id">) => {
    const newToast: ToastType = { id: generateRandomString(), message };
    setToasts((toasts) => [...toasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="absolute bottom-0 right-0 m-6 space-y-3">
            {toasts.map(({ id, message }) => (
              <Toast key={id} id={id} message={message} onClose={removeToast} />
            ))}
          </div>,
          document.getElementById("toast-container") ?? document.body
        )}
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
