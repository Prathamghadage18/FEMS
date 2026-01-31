"use client";
import React from 'react';
import { PageWraper } from '../hoc';

const SalesAndPurchase = () => {
  return (
    <main className="form-container">
      <h1 className="form-heading">Sales & Purchase</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-600">
          The Sales and Purchase tracking feature is under development.
          <br />
          You'll be able to record and manage all your crop sales and purchases here.
        </p>
      </div>
    </main>
  );
}

export default PageWraper(SalesAndPurchase);