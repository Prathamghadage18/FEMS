'use client';

import Image from "next/image";
import Link from "next/link";
import { not_found_img } from "../images";
import { MdRefresh } from "react-icons/md";

const NotFound = () => {
    const refreshPage = () => {
        window.location.reload();
    }

    return (
        <main className="w-screen h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
            <div className="h-1/2 max-h-64">
                {not_found_img ? (
                    <Image 
                        src={not_found_img}
                        className="h-full w-auto"
                        alt="Not Found"
                        width={400}
                        height={300}
                    />
                ) : (
                    <div className="text-8xl">🔍</div>
                )}
            </div>
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Page Not Found
                </h1>
                <p className="text-gray-600 mt-2">
                    Error <span className="text-red-500 font-bold">404</span> - The page you're looking for doesn't exist.
                </p>
            </div>
            <div className="flex gap-4">
                <Link 
                    href="/"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    Go Home
                </Link>
                <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg
                     flex items-center gap-2 transition-colors"
                    onClick={refreshPage}
                >
                    <span>Refresh</span>
                    <MdRefresh className="text-lg"/>
                </button>
            </div>
        </main>
    )
}

export default NotFound;