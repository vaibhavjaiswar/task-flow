"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface PopupContextType {
  open: boolean;
  popupTriggerRef: React.RefObject<HTMLDivElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupContext = createContext<PopupContextType>({
  open: false,
  popupTriggerRef: React.createRef<HTMLDivElement>(),
  setOpen: () => console.log("On open/close function initialisation"),
});

const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within PopupProvider");
  }
  return context;
};

interface PopupProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Popup({ children, open, setOpen }: PopupProps) {
  const popupTriggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <PopupContext.Provider value={{ open, popupTriggerRef, setOpen }}>
        {children}
      </PopupContext.Provider>
    </>
  );
}

interface PopupTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  children: React.ReactNode;
}

export function PopupTrigger({ children, ...rest }: PopupTriggerProps) {
  const { popupTriggerRef, setOpen } = usePopupContext();

  return (
    <div
      ref={popupTriggerRef}
      onClick={() => setOpen((open) => !open)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface PopupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  offset?: number;
  stickTo?: "left" | "right" | "stretch";
  children: React.ReactNode;
}

interface PopupContentPositionType {
  left: number | string;
  right: number | string;
  top: number | string;
  width: number | string;
}

let portalElementCurrent: HTMLElement | null = null;

export function PopupContent({
  children,
  offset = 0,
  stickTo = "stretch",
  ...rest
}: PopupContentProps) {
  const [position, setPosition] = useState<PopupContentPositionType>({
    left: "auto",
    right: "auto",
    top: "auto",
    width: "auto",
  });
  const popupContentRef = useRef<HTMLDivElement | null>(null);
  const { open, popupTriggerRef, setOpen } = usePopupContext();

  const { className, style, ...restCopy } = rest;

  useEffect(() => {
    portalElementCurrent = document.getElementById("popup-container");
  }, []);

  // closes popup if clicked outside popup content
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const contentRef = popupContentRef.current;
      if (contentRef && !contentRef.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, popupTriggerRef, setOpen]);

  // calculates content position
  useEffect(() => {
    const update = () => {
      if (!popupTriggerRef.current || !popupContentRef.current) return null;

      const triggerDOMRect = popupTriggerRef.current.getBoundingClientRect();
      const contentDOMRect = popupContentRef.current.getBoundingClientRect();

      const triggerBottom = triggerDOMRect.bottom;
      const triggerTop = triggerDOMRect.top;
      const triggerRight = triggerDOMRect.right;
      const triggerLeft = triggerDOMRect.left;
      const contentHeight = contentDOMRect?.height ?? 0;
      const isTouchingBottom =
        window.innerHeight <= triggerBottom + contentHeight + 20;

      const position = {
        left:
          stickTo === "left" || stickTo === "stretch" ? triggerLeft : "auto",
        right: stickTo === "right" ? window.innerWidth - triggerRight : "auto",
        top: isTouchingBottom
          ? triggerTop - contentHeight - offset
          : triggerBottom + offset,
        width: stickTo === "stretch" ? triggerDOMRect.width : "auto",
      };
      setPosition(position);
    };

    if (open) {
      // scroll anywhere
      window.addEventListener("scroll", update, true);

      // window resize
      window.addEventListener("resize", update);
    }

    // layout changes
    const ro = new ResizeObserver(update);
    if (popupTriggerRef.current) {
      ro.observe(popupTriggerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [offset, open, popupTriggerRef, stickTo]);

  if (!portalElementCurrent) return null;

  return createPortal(
    <div
      ref={popupContentRef}
      className={
        `fixed top-0 left-0 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-all shadow-lg ` + className
      }
      style={{
        left: position.left,
        right: position.right,
        width: position.width,
        top: position.top,
        ...style,
      }}
      {...restCopy}
    >
      {children}
    </div>,
    portalElementCurrent
  );
}
