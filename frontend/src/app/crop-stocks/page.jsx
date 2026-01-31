"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../hoc";
import { SelectInput, TextInput } from "../components/inputs";
import { cropStocksAPI, cropsAPI, isAuthenticated, getUser } from "../../services/api";

const CurrentCropStocks = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [stocks, setStocks] = useState([]);
	const [crops, setCrops] = useState([]);
	
	const [formData, setFormData] = useState({
		crop: '',
		quantity_on_hold: '',
		sold_quantity: '',
		expected_harvest_date: '',
		expected_selling_date: '',
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
			const [stocksRes, cropsRes] = await Promise.all([
				cropStocksAPI.getAll(),
				cropsAPI.getAll()
			]);
			setStocks(stocksRes.rows || []);
			setCrops(cropsRes.rows || []);
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
			if (!formData.crop) {
				setError('Crop is required');
				setSaving(false);
				return;
			}

			const user = getUser();
			const stockData = {
				...formData,
				quantity_on_hold: parseFloat(formData.quantity_on_hold) || 0,
				sold_quantity: parseFloat(formData.sold_quantity) || 0,
				farmer: user?.user_id,
			};

			await cropStocksAPI.create(stockData);
			setSuccess('Crop stock added successfully!');
			setFormData({
				crop: '', quantity_on_hold: '', sold_quantity: '',
				expected_harvest_date: '', expected_selling_date: '',
			});
			fetchData();
		} catch (err) {
			setError(err.message || 'Failed to save crop stock');
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="form-container">
			<h1 className="form-heading">Current Crop Stock</h1>
			
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
				<TextInput 
					label="Quantity on Hold (kg)"
					value={formData.quantity_on_hold}
					onChange={handleInputChange('quantity_on_hold')}
					placeholder="0"
					type="number"
				/>
				<TextInput 
					label="Sold Quantity (kg)"
					value={formData.sold_quantity}
					onChange={handleInputChange('sold_quantity')}
					placeholder="0"
					type="number"
				/>
				<TextInput 
					label="Expected Harvesting Date"
					value={formData.expected_harvest_date}
					onChange={handleInputChange('expected_harvest_date')}
					type="date"
				/>
				<TextInput 
					label="Expected Selling Date"
					value={formData.expected_selling_date}
					onChange={handleInputChange('expected_selling_date')}
					type="date"
				/>
			</div>

			<div className="form-btns-container mt-6">
				<button 
					className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
					onClick={() => setFormData({
						crop: '', quantity_on_hold: '', sold_quantity: '',
						expected_harvest_date: '', expected_selling_date: '',
					})}
				>
					Clear
				</button>
				<button 
					className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? 'Saving...' : '+ Add Stock'}
				</button>
			</div>

			{stocks.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Your Crop Stocks ({stocks.length})</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{stocks.map((stock) => (
							<div key={stock.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
								<h3 className="font-bold text-lg text-gray-800">{stock.crop_name}</h3>
								<p className="text-gray-600 mt-1">On Hold: <span className="font-semibold">{stock.quantity_on_hold} kg</span></p>
								<p className="text-gray-600">Sold: <span className="font-semibold">{stock.sold_quantity} kg</span></p>
								{stock.expected_harvest_date && <p className="text-gray-600">Harvest: <span className="font-semibold">{stock.expected_harvest_date}</span></p>}
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}

export default PageWraper(CurrentCropStocks);