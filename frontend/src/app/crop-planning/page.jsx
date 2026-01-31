"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../../app/hoc";
import { RadioInput, SelectInput, TextInput } from "../components/inputs";
import { cropPlanningAPI, cropsAPI, plotsAPI, isAuthenticated } from "../../services/api";

const CropPlanning = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [cropPlans, setCropPlans] = useState([]);
	const [crops, setCrops] = useState([]);
	const [plots, setPlots] = useState([]);
	
	const [formData, setFormData] = useState({
		crop: '',
		plot: '',
		planting_date: '',
		expected_harvest_date: '',
		is_mixed_cropping: false,
		seed_required: false,
		fertilizer_required: false,
		manpower_required: false,
	});

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/auth/signin');
			return;
		}
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [plansRes, cropsRes, plotsRes] = await Promise.all([
				cropPlanningAPI.getAll(),
				cropsAPI.getAll(),
				plotsAPI.getAll()
			]);
			setCropPlans(plansRes.rows || []);
			setCrops(cropsRes.rows || []);
			setPlots(plotsRes.rows || []);
		} catch (err) {
			setError('Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (field) => (e) => {
		setFormData(prev => ({ ...prev, [field]: e.target.value }));
	};

	const handleRadioChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value === 'Yes' }));
	};

	const handleSave = async () => {
		setError('');
		setSuccess('');
		setSaving(true);

		try {
			if (!formData.crop || !formData.plot) {
				setError('Crop and plot are required');
				setSaving(false);
				return;
			}

			await cropPlanningAPI.create(formData);
			setSuccess('Crop plan added successfully!');
			setFormData({
				crop: '', plot: '', planting_date: '', expected_harvest_date: '',
				is_mixed_cropping: false, seed_required: false, fertilizer_required: false, manpower_required: false,
			});
			fetchData();
		} catch (err) {
			setError(err.message || 'Failed to save crop plan');
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="form-container">
			<h1 className="form-heading">Crop Planning</h1>
			
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
				<SelectInput 
					label="Select Crop *"
					options={crops.map(c => c.id)}
					onChange={handleInputChange('crop')}
				/>
				<SelectInput 
					label="Select Plot *"
					options={plots.map(p => p.id)}
					onChange={handleInputChange('plot')}
				/>
				<TextInput 
					label="Planting Date"
					value={formData.planting_date}
					onChange={handleInputChange('planting_date')}
					type="date"
				/>
				<TextInput 
					label="Expected Harvest Date"
					value={formData.expected_harvest_date}
					onChange={handleInputChange('expected_harvest_date')}
					type="date"
				/>
				<RadioInput 
					label="Mixed Cropping"
					name="mixed-cropping"
					onSelect={(e) => handleRadioChange('is_mixed_cropping', e.target.value)}
					options={["Yes", "No"]}
				/>
				<RadioInput 
					label="Seed Required"
					name="seed-required"
					onSelect={(e) => handleRadioChange('seed_required', e.target.value)}
					options={["Yes", "No"]}
				/>
				<RadioInput 
					label="Fertilizer Required"
					name="fertilizer-required"
					onSelect={(e) => handleRadioChange('fertilizer_required', e.target.value)}
					options={["Yes", "No"]}
				/>
				<RadioInput 
					label="Manpower/Machinery Required"
					name="manpower-machinery-required"
					onSelect={(e) => handleRadioChange('manpower_required', e.target.value)}
					options={["Yes", "No"]}
				/>
			</div>

			<div className="form-btns-container mt-6">
				<button 
					className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
					onClick={() => setFormData({
						crop: '', plot: '', planting_date: '', expected_harvest_date: '',
						is_mixed_cropping: false, seed_required: false, fertilizer_required: false, manpower_required: false,
					})}
				>
					Clear
				</button>
				<button 
					className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? 'Saving...' : '+ Add Crop Plan'}
				</button>
			</div>

			{cropPlans.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Your Crop Plans ({cropPlans.length})</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{cropPlans.map((plan) => (
							<div key={plan.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
								<h3 className="font-bold text-lg text-gray-800">{plan.crop_name}</h3>
								<p className="text-gray-600 mt-1">Plot: <span className="font-semibold">{plan.plot_name}</span></p>
								{plan.planting_date && <p className="text-gray-600">Planted: <span className="font-semibold">{plan.planting_date}</span></p>}
								{plan.expected_harvest_date && <p className="text-gray-600">Harvest: <span className="font-semibold">{plan.expected_harvest_date}</span></p>}
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}

export default PageWraper(CropPlanning);