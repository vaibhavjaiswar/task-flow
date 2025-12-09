"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchUser, logout } from "@/apis";
import { useToast } from "@/context/toast-context";
import { useUserStore } from "@/store/useUserStore";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { LogOut, User } from "@deemlol/next-icons";

export default function NavBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { user, clearUser, setUser } = useUserStore();

  const handleLogout = useCallback(async () => {
    const response = await logout();

    if (!response.ok) {
      showToast({
        type: "error",
        message: "Error occured while logging out. Please try again.",
      });
      return;
    }

    clearUser();
    router.push("/login");
  }, [clearUser, router, showToast]);

  const fetchUserCall = useCallback(async () => {
    const response = await fetchUser();
    if (!response.ok) {
      showToast({
        type: "error",
        message: "Unable to fetch user data. Please login again.",
      });
      handleLogout();
      return;
    }
    const user = response.data?.user;
    if (!user) {
      showToast({
        type: "error",
        message: "Unable to fetch user data. Please login again.",
      });
      handleLogout();
      return;
    }
    setUser(user);
  }, [handleLogout, setUser, showToast]);

  useEffect(() => {
    fetchUserCall();
  }, [fetchUserCall]);

  return (
    <div className="flex items-center gap-2">
      <Popup open={isOpen} setOpen={setIsOpen}>
        <PopupTrigger>
          <div className="p-1 text-slate-100 flex justify-center items-center gap-1 cursor-pointer">
            <User size={20} className="text-slate-100" />
            {user ? (
              <span className="text-sm">{user.name}</span>
            ) : (
              <span className="inline-block w-16 h-5 bg-slate-100/20 rounded animate-pulse"></span>
            )}
          </div>
        </PopupTrigger>
        <PopupContent offset={8} stickTo="right" className="z-40">
          <div className="min-w-52 border border-slate-300 rounded-md shadow-lg overflow-hidden">
            <div
              className="px-4 py-2 text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Log out
            </div>
          </div>
        </PopupContent>
      </Popup>
    </div>
  );
}
