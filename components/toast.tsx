"use client";

import { X } from "@deemlol/next-icons";

// import { useEffect } from "react";

interface Props {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

export default function Toast({ id, message, onClose }: Props) {
  // useEffect(() => {
  //   const timer = setTimeout(onClose, 5000); // Auto close after 5 seconds
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="min-w-xs max-w-full sm:max-w-xs px-4 py-3 flex justify-between items-start gap-3 border border-slate-100 rounded shadow-md">
      {[id, message].join(" ")}
      <button
        className="flex justify-center items-center cursor-pointer"
        onClick={() => onClose(id)}
      >
        <X size={20} className="text-slate-800" />
      </button>
    </div>
  );
}
