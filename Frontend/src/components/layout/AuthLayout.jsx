import React from 'react'
function AuthLayout({children}) {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12 bg-white'>
            <h2 className='text-lg font-medium text-shadow-black text-black'>
                Employee Portal
            </h2>
            {children}
        </div>

       <div className="h-screen w-4/5 bg-blue-600">
    <img src="https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" className="h-full w-full" />
    
  </div>
    </div>
  )
}

export default AuthLayout