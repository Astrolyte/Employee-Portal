import React, { useState } from 'react'
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi"
import SideMenu from './SideMenu';
function Navbar({activeMenu}) {
  const [openSideMenu,setOpenSideMenu] = useState(false)

  return (
    <div className='sticky top-0 z-30 bg-slate-50 backdrop-blur-md shadow-md px-6 py-4 flex gap-5 items-center justify-between'>
      <button className='block lg:hidden text-black' onClick={()=>{
        setOpenSideMenu(!openSideMenu);
      }}>
        {openSideMenu? <HiOutlineX className='text-2xl' /> : <HiOutlineMenu className = "text-2xl"/>}
      </button>
        <h2 className='justify-items-center text-xl font-semibold text-gray-800'>Employee Portal</h2>
        {openSideMenu && (
          <div className = "fixed top-[61px] -ml-4 bg-white">
              <SideMenu activeMenu={activeMenu} />
            </div>
        )}
    </div>
  )
}

export default Navbar