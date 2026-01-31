import Image from "next/image";
import { fems_logo } from "../../images";
import { BsFacebook, BsLinkedin, BsYoutube, BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={fems_logo}
                alt="logo"
                className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                width={40}
                height={40}
              />
              <span className="text-green-400 font-bold text-lg">
                Maha Kisaan
              </span>
            </div>
            <p className="text-green-400 text-sm font-medium">
              Empowering Farmers Digitally
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-green-400 font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">
                Fertilizers
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Chemicals
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Pesticides
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-green-400 font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">
                About Us
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Service
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Help
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                FAQs
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-green-400 font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>Email: contact@fems.com</li>
              <li>Phone: +91 900000000</li>
            </ul>

            <p className="text-sm font-medium mb-2">Follow Us</p>
            <div className="flex gap-3">
              <span className="bg-green-500 p-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors">
                <BsFacebook className="w-4 h-4 text-white" />
              </span>
              <span className="bg-green-500 p-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors">
                <BsLinkedin className="w-4 h-4 text-white" />
              </span>
              <span className="bg-green-500 p-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors">
                <BsYoutube className="w-4 h-4 text-white" />
              </span>
              <span className="bg-green-500 p-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors">
                <BsInstagram className="w-4 h-4 text-white" />
              </span>
            </div>

            {/* Newsletter */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="text-gray-800 rounded-l-lg py-2 px-3 text-sm w-full focus:outline-none"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-r-lg px-4 py-2 text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />
        <p className="text-center text-sm text-gray-500">
          © 2024 FEMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
