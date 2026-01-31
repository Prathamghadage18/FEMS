"use client";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSwitcher = ({ className = "" }) => {
  const { language, changeLanguage } = useLanguage();

  const handleChange = (e) => {
    const newLang = e.target.value;
    changeLanguage(newLang);
    // Store in localStorage and reload
    localStorage.setItem("fems-language", newLang);
    window.location.reload();
  };

  return (
    <div className={`${className}`}>
      <select
        value={language}
        onChange={handleChange}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="en">🇬🇧 English</option>
        <option value="mr">🇮🇳 मराठी (Marathi)</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
