"use client";

import { useWindowWidth } from "@/hooks/use-width";
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
  bottom: number;
  left: number;
  right: number;
}

let portalElementCurrent: HTMLElement | null = null;

export function PopupContent({
  children,
  offset = 0,
  stickTo = "stretch",
  ...rest
}: PopupContentProps) {
  const [position, setPosition] = useState<PopupContentPositionType>();
  const popupContentRef = useRef<HTMLDivElement | null>(null);
  const { open, popupTriggerRef, setOpen } = usePopupContext();
  const width = useWindowWidth();

  const { className, style, ...restCopy } = rest;
  const positionTop = position ? position.bottom + offset + "px" : "auto";
  const positionLeft = position ? position.left + "px" : "auto";
  const positionRight = position ? width - position.right + "px" : "auto";

  useEffect(() => {
    portalElementCurrent = document.body;
  }, []);

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

  useLayoutEffect(() => {
    if (popupTriggerRef.current) {
      const { bottom, left, right } =
        popupTriggerRef.current.getBoundingClientRect();
      setPosition({ bottom, left, right });
    } else {
      console.log("Popup trigger not avaiable & window width", width);
    }
  }, [popupTriggerRef, width]);

  if (!portalElementCurrent) return null;

  return createPortal(
    <div
      ref={popupContentRef}
      className={
        `absolute top-0 left-0 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity shadow-lg ` + className
      }
      style={{
        top: positionTop,
        left:
          stickTo === "left" || stickTo === "stretch" ? positionLeft : "auto",
        right:
          stickTo === "right" || stickTo === "stretch" ? positionRight : "auto",
        ...style,
      }}
      {...restCopy}
    >
      {children}
    </div>,
    portalElementCurrent
  );
}
