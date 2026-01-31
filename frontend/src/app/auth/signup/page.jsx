"use client"
import { useState } from 'react';
import logo from '../../../images/logo.png';
import Image from 'next/image';
import { BsGoogle, BsFacebook, BsInstagram, BsTelegram, BsTwitterX } from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../services/api';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('FARMERS');
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const userData = {
        username: email,
        email: email,
        phone: phoneNumber,
        password: password,
        password2: confirmPassword,
        full_name: fullName,
        user_type: userType,
      };

      const response = await authAPI.register(userData);

      if (response.token) {
        router.push('/');
      }
    } catch (err) {
      const errorMessage = err.data ? 
        Object.values(err.data).flat().join(', ') : 
        err.message || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-green-200 min-h-screen flex flex-row">
      <div className='hidden lg:flex w-1/2 bg-white items-center justify-center'>
        <div className="text-center p-10">
          <div className="mb-6">
            <Image src={logo} alt="FEMS Logo" className="w-32 h-32 mx-auto" width={128} height={128} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to FEMS</h2>
          <p className="text-green-600 text-lg font-semibold">Empowering Farmers Digitally</p>
          <p className="text-gray-600 mt-4">Join our community of farmers and suppliers</p>
        </div>
      </div>

      <div className='lg:w-1/2 w-full py-4 px-2'>
        <div className="flex m-2 flex-row justify-end">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-green-600 border-0 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 font-medium cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl md:w-4/5 mb-4 md:mx-auto mx-2 shadow-xl">
          <div className="lg:hidden bg-green-50 rounded-full p-3 w-fit mx-auto mb-4 border-2 border-green-200">
            <Image src={logo} alt="FEMS Logo" className="w-20 h-20 object-contain" width={80} height={80} />
          </div>
          <h1 className="text-2xl md:text-3xl mb-6 text-center font-bold text-gray-800">Create an Account</h1>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignUp} className='space-y-4'>
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                First Name <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder='Enter Your First Name' id="firstName" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="middleName" className="block text-gray-700 font-semibold mb-1.5 text-sm">Middle Name</label>
              <input type="text" placeholder='Enter Your Middle Name' id="middleName" value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder='Enter Your Last Name' id="lastName" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" placeholder='Enter Your Email' id="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" placeholder='Enter Your Phone Number' id="phoneNumber" value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <input type="password" id="password" placeholder='Enter Password (min 6 characters)' value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input type="password" placeholder='Confirm Password' id="confirmPassword" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">User Type <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" id="farmer" name="userType" value="FARMERS" checked={userType === 'FARMERS'}
                    onChange={() => setUserType('FARMERS')} required 
                    className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700 font-medium">Farmer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" id="supplier" name="userType" value="SUPPLIER" checked={userType === 'SUPPLIER'}
                    onChange={() => setUserType('SUPPLIER')} 
                    className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700 font-medium">Supplier</span>
                </label>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="bg-gray-900 text-white py-3 rounded-xl w-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-green-700 hover:text-green-800 hover:underline">Sign In</Link>
          </div>
          
          <div className="flex items-center w-full justify-center my-4">
            <span className="h-px bg-gray-300 flex-1"></span>
            <span className="px-3 text-gray-500 text-sm font-medium">or continue with</span>
            <span className="h-px bg-gray-300 flex-1"></span>
          </div>

          <div className="flex justify-center gap-3 md:gap-4">
            <button type="button" className="bg-green-500 text-white p-3 text-lg rounded-full hover:bg-green-600 transition-colors shadow-md"><BsGoogle /></button>
            <button type="button" className="bg-blue-600 text-white p-3 text-lg rounded-full hover:bg-blue-700 transition-colors shadow-md"><BsFacebook /></button>
            <button type="button" className="bg-pink-600 text-white p-3 text-lg rounded-full hover:bg-pink-700 transition-colors shadow-md"><BsInstagram /></button>
            <button type="button" className="bg-blue-500 text-white p-3 text-lg rounded-full hover:bg-blue-600 transition-colors shadow-md"><BsTelegram /></button>
            <button type="button" className="bg-gray-800 text-white p-3 text-lg rounded-full hover:bg-gray-900 transition-colors shadow-md"><BsTwitterX /></button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            By clicking continue, you agree to our{' '}
            <Link href="#" className="font-semibold text-gray-700 hover:underline">Terms of Service</Link> and{' '}
            <Link href="#" className="font-semibold text-gray-700 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
