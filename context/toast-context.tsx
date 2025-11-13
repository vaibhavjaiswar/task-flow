"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import Toast from "@/components/toast";
import { ToastType } from "@/types/ui";
import { generateRandomString } from "@/utils";

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

  const showToast = ({ message, type = "neutral" }: Omit<ToastType, "id">) => {
    const newToast: ToastType = {
      id: `(${(toasts.length + 1).toString()})${generateRandomString()}`,
      message,
      type,
    };
    setToasts((toasts) => [...toasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 m-6 space-y-3">
          {toasts.map(({ id, message, type }) => (
            <Toast
              key={id}
              id={id}
              message={message}
              type={type}
              onClose={removeToast}
            />
          ))}
        </div>
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
