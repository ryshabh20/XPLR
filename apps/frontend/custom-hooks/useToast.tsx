"use client";

import React, { createContext, useContext } from "react";
import { ToastType, Toaster, toast } from "react-hot-toast";

interface ToastContextType {
  handleToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  handleToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const handleToast = (message: string, type: ToastType = "blank") => {
    if (type === "blank") return;
    toast[type](message, {
      position: "bottom-center",
    });
  };
  return (
    <ToastContext.Provider value={{ handleToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
