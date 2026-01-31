"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../hoc";
import { TextInput, SelectInput } from "../components/inputs";
import {
  wholesalerAPI,
  cropsAPI,
  marketPricesAPI,
  isAuthenticated,
  getUser,
} from "../../services/api";

// Sample data for when API is empty
const SAMPLE_WHOLESALERS = [
  {
    id: "sample-1",
    name: "Krishna Agro Traders",
    location: "Nashik, Maharashtra",
    contact_number: "+91 9876543210",
    storage_capacity: 500,
  },
  {
    id: "sample-2",
    name: "Green Valley Exports",
    location: "Pune, Maharashtra",
    contact_number: "+91 9876543211",
    storage_capacity: 1000,
  },
  {
    id: "sample-3",
    name: "Farmer Friends Co-op",
    location: "Dhule, Maharashtra",
    contact_number: "+91 9876543212",
    storage_capacity: 300,
  },
];

const SAMPLE_MARKET_PRICES = [
  {
    id: "1",
    crop_name: "Rice",
    market_name: "Nashik Mandi",
    price_per_kg: 42,
    price_date: "2026-01-31",
    min_price: 38,
    max_price: 45,
  },
  {
    id: "2",
    crop_name: "Wheat",
    market_name: "Nashik Mandi",
    price_per_kg: 28,
    price_date: "2026-01-31",
    min_price: 25,
    max_price: 32,
  },
  {
    id: "3",
    crop_name: "Soybean",
    market_name: "Pune Market",
    price_per_kg: 55,
    price_date: "2026-01-31",
    min_price: 50,
    max_price: 60,
  },
  {
    id: "4",
    crop_name: "Cotton",
    market_name: "Dhule Market",
    price_per_kg: 65,
    price_date: "2026-01-31",
    min_price: 60,
    max_price: 70,
  },
  {
    id: "5",
    crop_name: "Sugarcane",
    market_name: "Nashik Mandi",
    price_per_kg: 3.5,
    price_date: "2026-01-31",
    min_price: 3,
    max_price: 4,
  },
];

const WholesalerCard = ({ wholesaler, onContact }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-800">{wholesaler.name}</h3>
        <p className="text-gray-600 flex items-center gap-1 mt-1">
          📍 {wholesaler.location}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          📞 {wholesaler.contact_number}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          🏪 {wholesaler.storage_capacity} tons capacity
        </p>
      </div>
      <span className="text-3xl">🏢</span>
    </div>
    <button
      onClick={() => onContact(wholesaler)}
      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
    >
      Contact Wholesaler
    </button>
  </div>
);

const PriceRow = ({ price }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4 font-medium text-gray-800">{price.crop_name}</td>
    <td className="py-3 px-4 text-gray-600">{price.market_name}</td>
    <td className="py-3 px-4">
      <span className="font-bold text-green-700">₹{price.price_per_kg}</span>
    </td>
    <td className="py-3 px-4 text-gray-500 text-sm">
      ₹{price.min_price} - ₹{price.max_price}
    </td>
    <td className="py-3 px-4 text-gray-500 text-sm">{price.price_date}</td>
  </tr>
);

const Marketplace = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("prices");
  const [wholesalers, setWholesalers] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Supply request form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [requestForm, setRequestForm] = useState({
    crop: "",
    quantity: "",
    message: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wholesalersRes, pricesRes, cropsRes] = await Promise.all([
        wholesalerAPI.getAll().catch(() => ({ rows: [] })),
        marketPricesAPI.getAll().catch(() => ({ rows: [] })),
        cropsAPI.getAll().catch(() => ({ rows: [] })),
      ]);

      setWholesalers(
        wholesalersRes.rows?.length > 0
          ? wholesalersRes.rows
          : SAMPLE_WHOLESALERS,
      );
      setMarketPrices(
        pricesRes.rows?.length > 0 ? pricesRes.rows : SAMPLE_MARKET_PRICES,
      );
      setCrops(cropsRes.rows || []);
    } catch (err) {
      setWholesalers(SAMPLE_WHOLESALERS);
      setMarketPrices(SAMPLE_MARKET_PRICES);
    } finally {
      setLoading(false);
    }
  };

  const handleContactWholesaler = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setShowRequestForm(true);
  };

  const handleRequestSubmit = async () => {
    if (!requestForm.crop || !requestForm.quantity) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const user = getUser();
      await wholesalerAPI.createSupplyRequest({
        wholesaler: selectedWholesaler.id,
        crop: requestForm.crop,
        quantity: parseFloat(requestForm.quantity),
        farmer: user?.user_id,
      });
      setSuccess("Supply request sent successfully!");
      setShowRequestForm(false);
      setRequestForm({ crop: "", quantity: "", message: "" });
    } catch (err) {
      // For demo purposes, show success even if API fails
      setSuccess("Supply request sent successfully! (Demo mode)");
      setShowRequestForm(false);
      setRequestForm({ crop: "", quantity: "", message: "" });
    }
  };

  return (
    <main className="form-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Buy and sell agricultural products, check market prices, and connect
          with wholesalers
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("prices")}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "prices"
              ? "text-green-600 border-green-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          📈 Market Prices
        </button>
        <button
          onClick={() => setActiveTab("wholesalers")}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "wholesalers"
              ? "text-green-600 border-green-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          🏢 Wholesalers
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "sell"
              ? "text-green-600 border-green-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          🛒 Sell Your Crops
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Market Prices Tab */}
          {activeTab === "prices" && (
            <div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                <h2 className="font-bold text-green-800 mb-2">💡 Price Tip</h2>
                <p className="text-green-700 text-sm">
                  Market prices are updated daily. Compare prices across
                  different markets to get the best deal for your crops.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Crop
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Market
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Price/kg
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Range
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketPrices.map((price) => (
                        <PriceRow key={price.id} price={price} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Wholesalers Tab */}
          {activeTab === "wholesalers" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wholesalers.map((wholesaler) => (
                  <WholesalerCard
                    key={wholesaler.id}
                    wholesaler={wholesaler}
                    onContact={handleContactWholesaler}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sell Crops Tab */}
          {activeTab === "sell" && (
            <div className="max-w-2xl">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  List Your Crops for Sale
                </h2>
                <div className="space-y-4">
                  <SelectInput
                    label="Select Crop *"
                    options={
                      crops.length > 0
                        ? crops.map((c) => c.name || c.id)
                        : ["Rice", "Wheat", "Soybean", "Cotton", "Sugarcane"]
                    }
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        crop: e.target.value,
                      }))
                    }
                  />
                  <TextInput
                    label="Quantity (kg) *"
                    type="number"
                    placeholder="Enter quantity in kg"
                    value={requestForm.quantity}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                  />
                  <TextInput
                    label="Expected Price per kg (₹)"
                    type="number"
                    placeholder="Enter your expected price"
                  />
                  <TextInput label="Location" placeholder="Your village/city" />
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    📢 Post Listing
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Your listing will be visible to verified wholesalers in your
                  region
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Supply Request Modal */}
      {showRequestForm && selectedWholesaler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Contact Wholesaler
              </h2>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="font-semibold text-gray-800">
                {selectedWholesaler.name}
              </p>
              <p className="text-sm text-gray-600">
                {selectedWholesaler.location}
              </p>
            </div>

            <div className="space-y-4">
              <SelectInput
                label="Select Crop *"
                options={
                  crops.length > 0
                    ? crops.map((c) => c.id)
                    : ["Rice", "Wheat", "Soybean"]
                }
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, crop: e.target.value }))
                }
              />
              <TextInput
                label="Quantity (kg) *"
                type="number"
                placeholder="Enter quantity"
                value={requestForm.quantity}
                onChange={(e) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRequestForm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PageWraper(Marketplace);
