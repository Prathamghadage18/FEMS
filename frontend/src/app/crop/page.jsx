"use client";
import React from "react";
import { PageWraper } from "../hoc";

const CropMarket = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Crop Market Trends
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-xl shadow-md border border-green-100">
          <p className="font-semibold text-sm text-gray-600">Highest Demand</p>
          <h2 className="font-bold text-2xl text-gray-800 mt-1">Rice</h2>
          <p className="text-green-600 text-sm font-bold mt-2">
            ₹45 per kg/month
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-md border border-green-100">
          <p className="font-semibold text-sm text-gray-600">Best Price</p>
          <h2 className="font-bold text-2xl text-gray-800 mt-1">Wheat</h2>
          <p className="text-green-600 text-sm font-bold mt-2">
            ₹35 per kg/month
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-md border border-green-100">
          <p className="font-semibold text-sm text-gray-600">Trending</p>
          <h2 className="font-bold text-2xl text-gray-800 mt-1">Soybean</h2>
          <p className="text-green-600 text-sm font-bold mt-2">
            ₹55 per kg/month
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageWraper(CropMarket);
