"use client";

import { ReactNode } from "react";


export const Button = () => {
  return (
    <button
      className='bg-blue-500 text-white p-2 rounded-md'
      onClick={() => alert(`Hello from your  app!`)}
    >
     Hello
    </button>
  );
};
