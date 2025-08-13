import React from 'react'

const EmptyCard = ({message,btnText,onClick}) => {
  return (
    <div className='bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg'>
        <p className='w-2/3 text-xs md:text-[14px] text-slate-900 text-center leading-6 mt-7'>
            {message}
        </p>
        {btnText && (
            <button className='flex items-center gap-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-sky-200/60 hover:text-blue-500 text-nowrap px-6 py-2 mt-7' onClick={onClick}>
                {btnText}
            </button> 
        )}
    </div>
  )
}

export default EmptyCard