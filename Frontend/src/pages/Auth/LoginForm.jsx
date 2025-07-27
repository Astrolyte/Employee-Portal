import React, { useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import {Link, useNavigate} from "react-router-dom"
import AuthInput from '../../components/Input/AuthInput'
import { validateEmail } from '../../utils/helper'
function LoginForm() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null);

  const navigate = useNavigate();
  const handleLogin = async(e) =>{
      e.preventDefault();

      if(!validateEmail(email)){
        setError("Please enter a valid email address.")
        return ;
      }
      if(!password){
        setError("Please enter a password.");
        return;
      }
      setError("");

      //Login API
      try {
        
      } catch (error) {
        
      }
  }
  return (
    <AuthLayout>
    <div className='w-full lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center '>
      <h3 className="text-2xl font-semibold text-black">Welcome Back!!!</h3>
      <p className='text-sm text-gray-700 mt-[5px] mb-6 '>
          Please Enter your details to log in
      </p>
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthInput 
          value = {email}
          onChange = {(e)=>setEmail(e.target.value)}
          label = "Email address"
          placeholder = "john@example.com"
          type = "text"/>
          <AuthInput 
          value = {password}
          onChange = {(e)=>setPassword(e.target.value)}
          label = "Password"
          placeholder = "Min 8 Characters"
          type = "password"/>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type = "submit" className='w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300'>
            LOGIN
          </button>
          <p className='text-sm text-gray-700 mt-3 text-center '>
            Don't have an Account?{" "}
            <Link className='text-purple-700 font-medium underline hover:text-purple-600' to='/signup'>
              SignUp
            </Link>
          </p>
      </form>
    </div>
    </AuthLayout>
  )
}

export default LoginForm