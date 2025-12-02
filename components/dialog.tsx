"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open: boolean;
  onBackdropClick?: () => void;
}

export default function Dialog({
  children,
  open,
  onBackdropClick,
  ...rest
}: Props) {
  const [isVisible, setIsVisible] = useState(open);
  const { className, onClick, ...restCopy } = rest;

  useLayoutEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [open]);

  return createPortal(
    <div
      className={`fixed top-0 left-0 w-dvw h-dvh bg-slate-800/30 flex justify-center items-center ${
        open ? "opacity-100" : "opacity-0"
      } ${isVisible ? "visible" : "invisible"} transition-opacity`}
      onClick={onBackdropClick}
    >
      <div
        className={
          "max-w-4xl w-dvw h-dvh sm:w-auto sm:h-auto m-0 sm:m-6 md:m-8 lg:m-12 p-4 sm:p-6 md:p-8 text-slate-800 bg-slate-100 border border-slate-200 sm:rounded-lg shadow-xl " +
          className
        }
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        {...restCopy}
      >
        {children}
      </div>
    </div>,
    document.getElementById("dialog-container") ?? document.body
  );
}

// --------------------------------- Usage ---------------------------------
//
// <Dialog open={open} onBackdropClick={() => setOpen(false)}>
//   <h1>Lorem Ipsum</h1>
//   <p>
//     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
//     debitis blanditiis nostrum quasi architecto harum, aspernatur magni
//     fugit ab explicabo dignissimos et repellendus impedit officiis autem
//     maxime numquam sint beatae!
//   </p>
//   <button className="secondary-button" onClick={() => setOpen(false)}>
//     Close
//   </button>
// </Dialog>
//
// -------------------------------------------------------------------------
