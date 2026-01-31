"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../hoc";
import { SelectInput, TextArea, TextInput } from "../components/inputs";
import { waterResourcesAPI, plotsAPI, isAuthenticated } from "../../services/api";

const WaterResources = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [resources, setResources] = useState([]);
	const [plots, setPlots] = useState([]);
	
	const [formData, setFormData] = useState({
		name: '',
		resource_type: '',
		plot: '',
		availability_status: 'AVAILABLE',
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
			const [resourcesRes, plotsRes] = await Promise.all([
				waterResourcesAPI.getAll(),
				plotsAPI.getAll()
			]);
			setResources(resourcesRes.rows || []);
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

	const handleSave = async () => {
		setError('');
		setSuccess('');
		setSaving(true);

		try {
			if (!formData.name || !formData.resource_type || !formData.plot) {
				setError('Name, resource type, and plot are required');
				setSaving(false);
				return;
			}

			await waterResourcesAPI.create(formData);
			setSuccess('Water resource added successfully!');
			setFormData({ name: '', resource_type: '', plot: '', availability_status: 'AVAILABLE' });
			fetchData();
		} catch (err) {
			setError(err.message || 'Failed to save water resource');
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="form-container">
			<h1 className="form-heading">Water Resources</h1>
			
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

			<div className="flex flex-col gap-5">
				<TextInput 
					label="Water Resource Name *"
					value={formData.name}
					onChange={handleInputChange('name')}
					placeholder="Enter resource name"
				/>
				<SelectInput 
					label="Choose Resource Type *"
					options={["WELL", "CANAL", "RIVER", "TUBEWELL"]}
					onChange={handleInputChange('resource_type')}
				/>
				<SelectInput 
					label="Select Plot *"
					options={plots.map(p => p.id)}
					onChange={handleInputChange('plot')}
				/>
				<SelectInput 
					label="Availability Status"
					options={["AVAILABLE", "SCARCE", "NOT_AVAILABLE"]}
					onChange={handleInputChange('availability_status')}
				/>
			</div>

			<div className="form-btns-container mt-6">
				<button 
					className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
					onClick={() => setFormData({ name: '', resource_type: '', plot: '', availability_status: 'AVAILABLE' })}
				>
					Clear
				</button>
				<button 
					className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? 'Saving...' : '+ Add Water Resource'}
				</button>
			</div>

			{resources.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Your Water Resources ({resources.length})</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{resources.map((resource) => (
							<div key={resource.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
								<h3 className="font-bold text-lg text-gray-800">{resource.name}</h3>
								<p className="text-gray-600 mt-1">Type: <span className="font-semibold">{resource.resource_type}</span></p>
								<p className="text-gray-600">Status: <span className="font-semibold">{resource.availability_status}</span></p>
								{resource.plot_name && <p className="text-gray-600">Plot: <span className="font-semibold">{resource.plot_name}</span></p>}
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}

export default PageWraper(WaterResources);