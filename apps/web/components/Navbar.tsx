import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="container mx-auto text-white/80 ">
      <div className="flex items-center justify-between pt-5">
        <h1 className="text-3xl py-1 tracking-wider font-extrabold">CHAT</h1>
        <div className="flex items-center justify-center ">
          <button className="relative px-2 py-1 border rounded-lg border-white/50 hover:cursor-pointer">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,blue,red)] rounded-lg -z-10"></div>
            <span className="font-medium text-xl">Get Started</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
