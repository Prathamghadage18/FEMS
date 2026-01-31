"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../../../images/logo.png';
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(''); 	
  const [language, setLanguage] = useState('English'); 	
  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    // Here you can implement the logic to sign up the user
    console.log({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      password,
      confirmPassword,
      userType,
    });
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    // Here you can implement logic to change the language
  };

  return (
		<main className="min-h-screen w-screen bg-green-800 flex justify-end">
			<section className="bg-green-2 min-h-screen w-screen flex flex-col items-center justify-center lg:w-1/2 lg:rounded-2xl
				transtion-all duration-200 ease-linear"
			>
				<div className="bg-green-1 flex flex-col gap-6 items-center py-4 px-5 rounded-2xl lg:rounded-4xl w-4/5"
					style={{
						boxShadow: '5px 5px 10px #00000040',
					}}
				>
					<select
						value={language}
						onChange={(e) => handleLanguageChange(e.target.value)}
						className="self-end appearance-none bg-blue-500 border text-white px-4 py-1  rounded shadow focus:outline-none focus:shadow-outline"
					>
						<option value="English">English &#11162;  </option>
						<option value="Hindi">Hindi &#11162; </option>
						<option value="Marathi">Marathi &#11162; </option>
					</select>
					<logo className="bg-white rounded-full p-4 w-fit">
						<Image 
							src={logoImg}
							className="w-24 h-24"
						/>
					</logo>
					<h2 className="flex flex-col items-center gap-2">
						<span className="text-green-600 font-bold">Empowering Farmers Digitally</span>
						<span className="text-green-900 font-bold">Welcome</span>
					</h2>
					<form className="w-full flex flex-col items-center gap-3">
						<InputField 
							label="First Name : "
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Enter your first name"
						/>
						<InputField 
							label="Last Name : "
							value={middleName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Enter your middle name"
						/>
						<InputField 
							label="Last Name : "
							value={lastName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Enter your last name"
						/>
						<InputField 
							label="Phone Number : "
							value={phoneNumber}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="00000 00000"
						/>
						<InputField 
							label="Email : "
							value={email}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="abc@xyz.com"
						/>
						{/* <Link href="/forgot-password" className="font-semibold text-xs my-2">Forgot password?</Link> */}
						<button className="bg-black hover:bg-gray-800 w-full py-3 text-sm font-semibold text-center text-white rounded-2xl">
							Signup
						</button>
						<divider className="flex items-center w-full justify-center my-1">
							<span className="h-[0.5px] bg-gray-400 w-1/3"></span>
							<span className="w-1/2 text-center text-gray-500 text-sm">or continue with</span>
							<span className="h-[0.5px] bg-gray-400 w-1/3"></span>
							</divider>
						<Link 
							href="/login-google" 
							className="bg-white hover:bg-gray-200 rounded-2xl py-3 w-full flex gap-2 items-center justify-center"
						>
							<FcGoogle className="text-xl"/>
							<span className="font-semibold text-sm">Google</span>
						</Link>
					</form>
					<div className="w-full text-center mt-7 text-xs">
						By clicking you agree to our <b className="font-semibold">Terms of Service</b> <br/>
						<b className="font-semibold">and Privacy Policy</b>
					</div>
				</div>
			</section>
		</main>
	)
}

const InputField = ({placeholder, value, onChange,type="text",label}) => {
    return (
        <div className="flex flex-col w-full">
			<label className="font-semibold text-sm px-2 text-black">{label}</label>
			<input 
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				type={type}
				className="outline-none py-2 px-4 border rounded-lg"
			/>
		</div>
    )
}