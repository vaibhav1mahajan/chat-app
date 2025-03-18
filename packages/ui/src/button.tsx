"use client";

import { ReactNode } from "react";

export const Button = () => {
  return (
    <button
      className="p-2 text-white bg-blue-500 rounded-md px-120"
      onClick={() => alert(`Hello from your  app!`)}
    >
      Hello
    </button>
  );
};
