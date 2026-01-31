"use client";
import Link from "next/link";
import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

import { navLinks } from "../../constants";

const NavItem = ({title, path, options}) => {
  if(!path){
    return (
      <div className="relative group text-sm font-semibold py-3">
        <button
          className="w-full h-full px-3 text-gray-700 hover:text-green-600 transition-colors"
        >{title}</button>
        <ul className="w-max min-w-[160px] list-none hidden group-hover:flex hover:flex flex-col 
          absolute left-0 top-[90%] border border-gray-200 rounded-lg bg-white shadow-lg z-20"
        >
          {options.map((option, idx) => (
            <Link 
              key={idx}
              href={option.path} 
              className="px-4 py-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              {option.title}
            </Link>
          ))}
        </ul>
      </div>
    );
  }
  
  return (
    <Link href={path} className="text-sm font-semibold px-3 py-3 text-gray-700 hover:text-green-600 transition-colors">
      {title}
    </Link>
  )
}

const NavItemMobile = ({title, path, options}) => {
  const [toggle, setToggle] = useState(false);
  if(!path){
    return (
      <div className="px-3 py-2 flex font-semibold items-start flex-col">
        <button
          onClick={() => setToggle(!toggle)}
          className="text-gray-800 hover:text-green-600 transition-colors"
        >{title}</button>
        
        {toggle && options && options.length > 0 && 
          <ul className="flex flex-col list-none pl-3 pt-2 border-l-2 border-green-200 ml-2 mt-1">
            {options.map((option, idx) => (
              <Link 
                key={idx}
                href={option.path} 
                className="text-gray-600 hover:text-green-600 py-1.5 font-medium transition-colors"
              >
                {option.title}
              </Link>
          ))}
          </ul>
        }
      </div>
    );
  }
  
  return (
    <Link href={path} className="px-3 py-2 font-semibold text-gray-800 hover:text-green-600 transition-colors">
      {title}
    </Link>
  )
}


const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="w-full flex justify-center items-center bg-white border-b border-gray-100">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-2 justify-center 
        border border-gray-200 my-3 px-4 rounded-full bg-gray-50 shadow-sm">
        {navLinks.map((navlink, idx) => (
          <NavItem 
            key={idx}
            title={navlink.title} 
            path={navlink?.path}
            options={navlink?.options}
          />
        ))}
      </ul>

      {/* Mobile Navigation */}
      <div className="w-full flex items-center justify-end md:hidden relative pr-4 py-2">
        <button className="text-3xl text-gray-700 hover:text-green-600 transition-colors p-2">
          {toggle ? 
            <RxCross2
              onClick={() => setToggle(false)}
            /> : 
            <RiMenu3Line
              onClick={() => setToggle(true)}
            />
          }
        </button>
           
        {toggle &&
          <ul className="bg-white flex flex-col absolute z-20 right-4 top-14 shadow-xl border border-gray-200 p-3 rounded-xl min-w-[200px]">
            {navLinks.map((navlink, idx) => (
              <NavItemMobile 
                key={idx}
                title={navlink.title} 
                path={navlink?.path}
                options={navlink?.options}
              />
            ))}
          </ul>
        }
      </div>
    </nav>
  )
}

export default Navbar;