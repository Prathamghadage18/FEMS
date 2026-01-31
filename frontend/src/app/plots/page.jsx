"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../hoc";
import { SelectInput, TextInput } from "../components/inputs";
import { plotsAPI, isAuthenticated, getUser } from "../../services/api";

const Plots = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [plots, setPlots] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    survey_number: '',
    longitude: '',
    latitude: '',
    soil_type: '',
    ownership: '',
    village: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const response = await plotsAPI.getAll();
      setPlots(response.rows || []);
    } catch (err) {
      setError('Failed to load plots');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!formData.name || !formData.area) {
        setError('Plot name and area are required');
        setSaving(false);
        return;
      }

      const user = getUser();
      const plotData = {
        ...formData,
        area: parseFloat(formData.area) || 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        farmer: user?.user_id,
      };

      await plotsAPI.create(plotData);
      setSuccess('Plot added successfully!');
      setFormData({
        name: '', area: '', survey_number: '', longitude: '',
        latitude: '', soil_type: '', ownership: '', village: '',
      });
      fetchPlots();
    } catch (err) {
      setError(err.message || 'Failed to save plot');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="form-container">
      <h1 className="form-heading">Plots</h1>
      
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

      <div className="form-grid">
        <TextInput
          label="Plot Name *"
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="Enter plot name"
        />
        <TextInput
          label="Plot Size (acres) *"
          value={formData.area}
          onChange={handleInputChange('area')}
          placeholder="0"
          type="number"
        />
        <TextInput
          label="Survey Number"
          value={formData.survey_number}
          onChange={handleInputChange('survey_number')}
          placeholder="0000000"
        />
        <TextInput
          label="Longitude"
          value={formData.longitude}
          onChange={handleInputChange('longitude')}
          placeholder={`00.0000`}
          type="text"
        />
        <TextInput
          label="Latitude"
          value={formData.latitude}
          onChange={handleInputChange('latitude')}
          placeholder={`00.0000`}
          type="text"
        />
        <SelectInput
          label="Soil Type"
          options={["CLAY", "SANDY", "LOAMY", "SILT", "PEAT", "CHALK"]}
          onChange={handleInputChange('soil_type')}
        />
        <TextInput 
          label="Ownership" 
          value={formData.ownership}
          onChange={handleInputChange('ownership')} 
          placeholder="Owned / Leased" 
        />
        <TextInput 
          label="Village" 
          value={formData.village}
          onChange={handleInputChange('village')} 
          placeholder="Village name" 
        />
      </div>

      <div className="form-btns-container">
        <button 
          className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          onClick={() => setFormData({
            name: '', area: '', survey_number: '', longitude: '',
            latitude: '', soil_type: '', ownership: '', village: '',
          })}
        >
          Clear
        </button>
        <button 
          className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : '+ Add Plot'}
        </button>
      </div>

      {/* Display existing plots */}
      {plots.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Plots ({plots.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plots.map((plot) => (
              <div key={plot.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg text-gray-800">{plot.name}</h3>
                <p className="text-gray-600 mt-1">Area: <span className="font-semibold">{plot.area} acres</span></p>
                {plot.soil_type && <p className="text-gray-600">Soil: <span className="font-semibold">{plot.soil_type}</span></p>}
                {plot.village && <p className="text-gray-600">Village: <span className="font-semibold">{plot.village}</span></p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default PageWraper(Plots);
