"use client";

import { logout } from "@/apis";
import { useToast } from "@/context/toast-context";
import { LogOut, User } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popup, PopupContent, PopupTrigger } from "./popup";

export default function NavBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    console.log("logout");
    const response = await logout();

    if (!response.ok) {
      showToast({
        type: "error",
        message: "Error occured while logging out. Please try again.",
      });
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2">
      <Popup open={isOpen} setOpen={setIsOpen}>
        <PopupTrigger>
          <div className="p-1 text-slate-100 flex justify-center items-center gap-1 cursor-pointer">
            <User size={20} className="text-slate-100" />
            <span className="text-sm">{"User Name"}</span>
          </div>
        </PopupTrigger>
        <PopupContent offset={8} stickTo="right">
          <div className="min-w-52 text-slate-800 bg-slate-100 border border-slate-300 rounded-md shadow-lg">
            <div
              className="px-4 py-2 flex items-center gap-2 hover:bg-slate-200 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Log out
            </div>
          </div>
        </PopupContent>
      </Popup>
      {/* <div className="relative">
        <div
          className="p-1 text-slate-100 flex justify-center items-center gap-1 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <User size={20} className="text-slate-100" />
          <span className="text-sm">{"User Name"}</span>
        </div>
        <div
          ref={popupRef}
          className={`absolute top-0 left-0 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          } transition-opacity`}
        >
          <div className="text-slate-800 bg-slate-100 border border-slate-300 rounded-md shadow-md">
            <div
              className="px-4 py-2 flex items-center gap-2 hover:bg-slate-200 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Log out
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
