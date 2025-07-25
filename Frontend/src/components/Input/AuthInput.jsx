import React from 'react'
import { useState } from 'react';
function AuthInput({value,onChange,
          label,
          placeholder,
          type}) {
            const [showPassword,setShowPassword] = useState(false);
            const toggleShowPassword = () => {
                setShowPassword(!showPassword);
            }
  return (
    <div className='text-black'>
        <label className='text-[13px] text-black-50 font-medium block mb-1 '>{label}</label>
        <div className='input-box relative'>
            <input type= {type === 'password' ? (showPassword ? "text" : "password") : type}
            placeholder = {placeholder}
            className = "w-full rounded-md border border-gray-300 bg-white py-2 px-4 pr-16 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value = {value}
            onChange = {(e) => onChange(e)}/>
            {type === 'password' && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
        </div>
    </div>
  )
}

export default AuthInput