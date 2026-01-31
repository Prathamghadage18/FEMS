
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { PageWraper } from "../../app/hoc";
import { yourCrops as defaultCrops, relatedCrops } from '../../constants';
import { cropsAPI, isAuthenticated } from '../../services/api';

const CropCard = ({index, name, variety, rate, img, description}) => {
  // Use default image if none provided
  const imageSrc = img || defaultCrops[0]?.img;
  
  return (
    <div className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100" key={index}>
      <div className="bg-gray-100 w-40 h-28 rounded-lg overflow-hidden">
        {imageSrc ? (
          <Image 
            alt={name || 'Crop'}
            src={imageSrc}
            className="w-full h-full object-cover rounded-lg hover:scale-110 transition-all duration-300"
            width={160}
            height={112}
          />
        ) : (
          <div className="w-full h-full bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🌾</span>
          </div>
        )}
      </div>
      <div className="flex flex-col pt-3">
        <span className="font-bold text-gray-800 text-lg">{name}</span>
        <span className="text-sm text-gray-600 font-medium">{variety || description || 'Various'}</span>
        {rate && <span className="text-sm font-bold text-green-700 mt-1">₹{rate} per kg</span>}
      </div>
    </div>
  )
}

const Crops = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await cropsAPI.getAll();
      setCrops(res.rows || []);
    } catch (err) {
      setError('Failed to load crops');
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm font-medium">
          {error} - Showing sample data
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Crops</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : crops.length > 0 ? (
          <div className="flex flex-wrap gap-4 md:gap-6">
            {crops.map((crop, index) => (
              <CropCard 
                key={crop.id || index} 
                index={index}
                name={crop.name || crop.id}
                variety={crop.variety}
                rate={crop.price_per_kg}
                description={crop.description}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 md:gap-6">
            {defaultCrops.map((crop, index) => (
              <CropCard key={index} index={index} {...crop} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Related Crops</h2>
        <div className="flex flex-wrap gap-4 md:gap-6">
          {relatedCrops.map((crop, index) => (
            <CropCard key={index} index={index} {...crop} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PageWraper(Crops);