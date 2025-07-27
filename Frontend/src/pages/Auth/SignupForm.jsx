import React from "react";
import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthInput from "../../components/Input/AuthInput";
import { validateEmail, validatePassword } from "../../utils/helper";
function SignupForm() {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please Enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError(
    "Invalid Password:\n" +
    "Your Password must have minimum :\n" +
    "• 1 lowercase letter\n" +
    "• 1 uppercase letter\n" +
    "• One digit\n" +
    "• At least 8 characters"
  );
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password should be same");
      return;
    }
    setError("");

    //api call for Signup
    try {
    } catch (error) {}
  };
  return (
    <AuthLayout>
      <div className="w-full lg:w-[70%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-black"></h3>
        <p className="text-sm text-gray-700 mt-[5px] mb-6 ">
          Please Enter your details to Sign In.
        </p>
        <form onSubmit={handleSignup} className="space-y-5">
          <AuthInput
            value={name}
            onChange={(e) => setFirstName(e.target.value)}
            label="Name"
            placeholder="john"
            type="text"
          />
          <AuthInput
            value={profilePhoto}
            onChange={(e) => setProfilePhoto(e.target.value)}
            label="Upload your Profile Photo"
            placeholder=""
            type="file"
          />
          <AuthInput
            value={dateOfBirth}
            onChange={(e) => setDOB(e.target.value)}
            label="DOB"
            placeholder="DD/MM/YY"
            type="date"
          />
          <AuthInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            placeholder="john@example.com"
            type="text"
          />
          <AuthInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          <AuthInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center bg-purple-700 hover:bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignupForm;
