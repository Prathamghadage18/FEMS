'use client' 
import { BsPencil, BsPlusCircle } from 'react-icons/bs'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { PageWraper } from '../hoc';
import { sample_profile_img } from '../../images';
import { TextArea, TextInput } from "../components/inputs";
import { authAPI, isAuthenticated, getUser, setUser } from '../../services/api';

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    district: '',
    region: '',
    bio: '',
  });
  const [cropsInfo, setCropsInfo] = useState(['']);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getProfile();
      const user = res.data || res;
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
        district: user.district || '',
        region: user.region || '',
        bio: user.bio || '',
      });
      if (user.crops_info && Array.isArray(user.crops_info)) {
        setCropsInfo(user.crops_info.length > 0 ? user.crops_info : ['']);
      }
    } catch (err) {
      // Use cached user data if API fails
      const cachedUser = getUser();
      if (cachedUser) {
        setFormData({
          full_name: cachedUser.full_name || '',
          phone: cachedUser.phone || '',
          email: cachedUser.email || '',
          district: cachedUser.district || '',
          region: cachedUser.region || '',
          bio: cachedUser.bio || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updateData = {
        ...formData,
        crops_info: cropsInfo.filter(c => c.trim() !== ''),
      };

      const res = await authAPI.updateProfile(updateData);
      
      // Update local storage with new user data
      const currentUser = getUser();
      if (currentUser) {
        setUser({ ...currentUser, ...updateData });
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCrop = () => {
    setCropsInfo([...cropsInfo, '']);
  };

  const handleCropInfoChange = (e, index) => {
    const updatedCropsInfo = [...cropsInfo];
    updatedCropsInfo[index] = e.target.value;
    setCropsInfo(updatedCropsInfo);
  };

  const handleRemoveCrop = (index) => {
    if (cropsInfo.length > 1) {
      setCropsInfo(cropsInfo.filter((_, i) => i !== index));
    }
  };

  if (loading) {
    return (
      <main className="form-container">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="form-container">
      <h1 className="form-heading">
        <BsPencil />
        Edit profile
      </h1>

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

      <section className="flex items-center gap-5 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <Image 
          src={sample_profile_img}
          className="w-20 h-20 rounded-full object-contain"
          alt="Profile"
          width={80}
          height={80}
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-800">{formData.full_name || 'User'}</h2>
          <span className="text-gray-500 text-sm">{formData.email}</span>
        </div>
      </section>

      <section className="flex flex-col gap-7">
        <TextInput 
          label="Full Name"
          value={formData.full_name}
          onChange={handleInputChange('full_name')}
          placeholder="e.g. Ram Naresh"
        />
        <TextInput 
          label="Phone number"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          type="tel"
          placeholder="+91 XXXXXXXXXX"
        />
        <TextInput 
          label="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          type="email"
          placeholder="e.g. abc@xyz.com"
        />
        <TextInput 
          label="District"
          value={formData.district}
          onChange={handleInputChange('district')}
          placeholder="e.g. Dhule (Maharashtra)"
        />
        <TextInput 
          label="Region"
          value={formData.region}
          onChange={handleInputChange('region')}
          placeholder="e.g. Vidarbha (Maharashtra)"
        />
        <div className="w-full flex flex-col">
          <label className="text-sm font-semibold text-gray-700 pl-1 mb-2">Crops You Grow</label>
          {cropsInfo.map((crop, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <TextInput 
                value={crop} 
                onChange={(e) => handleCropInfoChange(e, index)}
                placeholder="e.g. Wheat, Rice, Cotton"
              />
              {cropsInfo.length > 1 && (
                <button 
                  onClick={() => handleRemoveCrop(index)}
                  className="text-red-500 hover:text-red-700 px-2 font-medium"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button className="flex flex-start items-center gap-2 p-2 text-green-600 hover:text-green-700"
            onClick={handleAddCrop}
          >
            <BsPlusCircle />
            <span className="hover:underline font-medium">Add crop info</span>
          </button>
        </div>
        <TextArea 
          label="Bio"
          value={formData.bio}
          onChange={handleInputChange('bio')}
          placeholder="I am a farmer from ... region, and ..."
        />
      </section>
      <button 
        onClick={handleSaveChanges}
        disabled={saving}
        className="py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 w-fit disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      </button>
    </main>
  );
};

export default PageWraper(EditProfile);