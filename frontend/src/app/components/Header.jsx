import Image from "next/image";
import { BsSearch } from "react-icons/bs";

import { fems_logo } from "../../images";
import { styles } from "../../styles";

const Header = () => {
	return (
		<header className="w-full flex flex-col overflow-hidden shadow-sm">
			<section className="bg-gray-900 py-3 px-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="bg-white h-8 w-8 flex items-center justify-center rounded-full p-1">
						<Image 
							src={fems_logo}
							alt="FEMS"
							className="w-full h-full object-contain"
							width={24}
							height={24}
						/>
					</span>
					<span className="text-green-400 font-bold text-lg">Maha Kisan</span>
				</div>
			</section>

			<section className="flex p-4 justify-between items-center text-sm bg-white border-b border-gray-100">
				<div className="flex items-center gap-3 flex-wrap">
					<span className="flex items-center gap-2 border border-gray-300 py-2 px-3 rounded-lg bg-gray-50">
						<BsSearch className="text-gray-500"/>
						<input 
							placeholder="Search..."
							className="outline-none w-24 md:w-64 bg-transparent text-gray-700 placeholder-gray-400"
						/>
						<Image 
							src={fems_logo}
							alt="FEMS-SEARCH"
							className="w-5 h-5 object-contain"
							width={20}
							height={20}
						/>
					</span>
					<select className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 w-24 md:w-40 cursor-pointer">
						<option value="" disabled>Region</option>
						<option>Kokan - Maharashtra</option>
						<option>Vidarbha - Maharashtra</option>
						<option>Kunnur - Kerala</option>
					</select>
					<select className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 w-24 md:w-40 cursor-pointer">
						<option value="" disabled>Language</option>
						<option>English</option>
						<option>Hindi</option>
						<option>Marathi</option>
					</select>
				</div>
				<div className="flex gap-3 items-center">
					<button className="py-2 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200">
						Settings
					</button>
					<button className="py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors hidden md:block">
						Share
					</button>
				</div>
			</section>
		</header>
	)
};

export default Header;