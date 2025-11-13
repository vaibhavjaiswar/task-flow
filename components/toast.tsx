"use client";

import { useEffect } from "react";
import { ToastVariantType } from "@/types/ui";
import { X } from "@deemlol/next-icons";

interface Props {
  id: string;
  type: ToastVariantType;
  message: string;
  onClose: (id: string) => void;
}

const variantStyles: Record<ToastVariantType, string> = {
  error: "bg-red-600! text-white! border! border-red-700!",
  info: "bg-slate-300! text-slate-800! border! border-slate-400!",
  neutral: "bg-white! text-slate-800! border! border-slate-300!",
  success: "bg-green-600! text-white! border! border-green-700!",
  warning: "bg-yellow-400! text-slate-900! border! border-yellow-600!",
};

const closeButtonStyles: Record<ToastVariantType, string> = {
  error: "text-slate-100",
  info: "text-slate-800",
  neutral: "text-slate-800",
  success: "text-slate-100",
  warning: "text-slate-800",
};

export default function Toast({ id, message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-w-xs max-w-full sm:max-w-xs px-4 py-3 flex justify-between items-start gap-3 rounded-md shadow-sm hover:shadow-md ${variantStyles[type]}`}
    >
      {message}
      <button
        className="flex justify-center items-center cursor-pointer"
        onClick={() => onClose(id)}
      >
        <X size={20} className={closeButtonStyles[type]} />
      </button>
    </div>
  );
}
