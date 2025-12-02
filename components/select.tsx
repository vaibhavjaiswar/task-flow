import { ChevronDown, ChevronUp } from "@deemlol/next-icons";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { useState } from "react";

export interface SelectProps<T extends string | number> {
  value: T | null;
  onChange: (value: T) => void;
  options: [T, string][];
  placeholder?: string;
}
export default function Select<T extends string | number>({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    value !== null ? options.find(([v]) => v === value)?.[1] : null;

  const handleSelect = (val: T) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <Popup open={open} setOpen={setOpen}>
      <PopupTrigger>
        <div className="w-full bg-slate-100 text-slate-900 border border-slate-200 rounded cursor-pointer flex justify-between items-center gap-2">
          <div className="w-[calc(100%)] px-2 py-1.5">
            {selectedLabel ?? placeholder}
          </div>
          <div className="w-9 h-9 flex justify-center items-center">
            {open ? (
              <ChevronUp size={24} className="text-slate-800" />
            ) : (
              <ChevronDown size={24} className="text-slate-800" />
            )}
          </div>
        </div>
      </PopupTrigger>
      <PopupContent
        stickTo="stretch"
        offset={6}
        className="z-10 max-h-96 bg-white border border-slate-200 rounded-md overflow-auto"
      >
        {options.map(([value, label]) => (
          <div
            key={value}
            className="px-4 py-2 hover:bg-slate-200 cursor-pointer"
            onClick={() => handleSelect(value)}
          >
            {label}
          </div>
        ))}
      </PopupContent>
    </Popup>
  );
}
