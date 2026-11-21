"use client";
import React from "react";
import Navbar from "@/components/common/navbar/navbar";
import { Toaster } from "sonner";
import AuthContextProvider from "@/context/AuthContext";
import CartContextProvider from "@/context/CartContext";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import WishlistProvider from "@/context/WishlistContext";

export default function ProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthContextProvider>
        <CartContextProvider>
          <Provider store={store}>
            <WishlistProvider>
              <Navbar />
              <Toaster position="top-center" richColors={true} />
              {children}
            </WishlistProvider>
          </Provider>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  );
}
