import React, { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import UserDetailsCard from '../cards/UserDetailsCard.jsx'
import { UserContext } from '../../context/UserContext.jsx'

function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content Area - No gap */}
          <div className="flex-1 min-w-0">
            <div className="max-w-full">
              {children}
            </div>
          </div>

          {/* User Details Card - Desktop Only */}
          <div className="hidden xl:block flex-shrink-0 w-80 pr-4">
            <div className="sticky top-20">
              <UserDetailsCard
                avatar={user?.avatar}
                Name={user?.Name}
                Email={user?.email}
                totalPollsVotes={user?.totalPollsVotes}
                totalPollsCreated={user?.totalPollsCreated}
                totalIdeasCreated={user?.totalIdeasCreated}
                totalIdeasVotes={user?.totalIdeasVotes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout;