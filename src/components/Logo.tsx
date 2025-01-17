import React from "react";
import logoImg from "../../public/imgs/logo.png";
import Image from "next/image";
export default function Logo() {
  return (
    <div className="flex items-center  p-3 ">
      <Image
        src={logoImg}
        alt=" Logo"
        width={1000}
        height={1000}
        className=" w-24 aspect-ratio-[1/1]"
      />
      <span className="font-mono font-light text-white/90 mt-4">Resturant</span>
    </div>
  );
}
