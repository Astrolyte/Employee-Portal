import React from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

function DashboardLayout({children, activeMenu}) {
  return (
    <div>
        <Navbar />


        <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu = {activeMenu} />
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout