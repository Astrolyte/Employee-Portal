import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../Hooks/useUserAuth';

function Home() {
  useUserAuth();
  return (
    <DashboardLayout activeMenu='Dashboard'>
    <div>Home</div>
    </DashboardLayout>
  )
}

export default Home