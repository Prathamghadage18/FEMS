'use client';

import logoImg from '../../../images/logo.png';
import Image from 'next/image';
import { useState } from 'react';
import { CiUser, CiLock } from 'react-icons/ci';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../services/api';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email || !password) {
                setError('Please enter email and password');
                setLoading(false);
                return;
            }

            const response = await authAPI.login(email, password);
            
            if (response.token) {
                // Redirect to home page after successful login
                router.push('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-screen bg-gradient-to-br from-green-700 to-green-900 flex justify-center lg:justify-end">
            <section className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen w-full flex items-center justify-center lg:w-1/2 lg:rounded-l-3xl transition-all duration-200 ease-linear">
                <div className="bg-white flex flex-col gap-5 items-center py-6 px-6 rounded-2xl lg:rounded-3xl w-11/12 max-w-md shadow-xl border border-green-100">
                    <div className="bg-green-50 rounded-full p-3 w-fit border-2 border-green-200">
                        <Image 
                            src={logoImg}
                            alt="FEMS Logo"
                            className="w-20 h-20 object-contain"
                            width={80}
                            height={80}
                        />
                    </div>
                    <h2 className="flex flex-col items-center gap-1 text-center">
                        <span className="text-green-600 font-semibold text-sm">Empowering Farmers Digitally</span>
                        <span className="text-gray-800 font-bold text-2xl">Welcome Back</span>
                    </h2>
                    
                    {error && (
                        <div className="w-full bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}
                    
                    <form className="w-full flex flex-col items-center gap-3" onSubmit={handleLogin}>
                        <InputField 
                            placeholder="Email"
                            value={email}
                            icon={<CiUser />}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField 
                            placeholder="Password"
                            value={password}
                            icon={<CiLock />}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Link href="/auth/forgot-password" className="font-medium text-sm text-green-700 hover:text-green-800 my-1">
                            Forgot password?
                        </Link>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 hover:bg-gray-800 w-full py-3 text-sm font-semibold text-center text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="flex items-center w-full justify-center my-2">
                            <span className="h-px bg-gray-300 flex-1"></span>
                            <span className="px-3 text-gray-500 text-sm font-medium">or continue with</span>
                            <span className="h-px bg-gray-300 flex-1"></span>
                        </div>
                        <button 
                            type="button"
                            className="bg-white hover:bg-gray-50 border border-gray-300 rounded-xl py-3 w-full flex gap-2 items-center justify-center transition-colors"
                        >
                            <FcGoogle className="text-xl"/>
                            <span className="font-semibold text-sm text-gray-700">Google</span>
                        </button>
                    </form>
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="font-semibold text-green-700 hover:text-green-800 hover:underline">
                            Sign up
                        </Link>
                    </div>
                    <div className="w-full text-center text-xs text-gray-500 leading-relaxed">
                        By clicking you agree to our{' '}
                        <span className="font-semibold text-gray-700">Terms of Service</span>
                        <br />and{' '}
                        <span className="font-semibold text-gray-700">Privacy Policy</span>
                    </div>
                </div>
            </section>
        </main>
    )
}

const InputField = ({placeholder, value, onChange, type="text", icon}) => {
    return (
        <div className="px-4 py-3 bg-gray-50 rounded-xl w-full flex items-center gap-3 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
            {icon && <span className="text-xl text-gray-500">{icon}</span>}
            <input 
                type={type} 
                placeholder={placeholder}
                className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default Login;