"use client";
import { GetLoggedUserCart } from "@/actions/Cart.actions";
import { CartDataInterface } from "@/types/cart.type";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";

type CartContextType = {
  noCartItem: number;
  handleCart(): void;
};

export const Cartcontext = createContext<CartContextType | null>(null);

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [noCartItem, setnoCartItem] = useState(0);
  const { status } = useSession();

  async function handleCart() {
    try {
      const res: CartDataInterface = await GetLoggedUserCart();
      const noOfItem = res.data.products.reduce(
        (acc, prod) => acc + prod.count,
        0,
      );
      setnoCartItem(noOfItem);
    } catch {
      setnoCartItem(0);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      handleCart();
    } else if (status === "unauthenticated") {
      setnoCartItem(0);
    }
  }, [status]);

  return (
    <>
      <Cartcontext.Provider value={{ noCartItem, handleCart }}>
        {children}
      </Cartcontext.Provider>
    </>
  );
}
