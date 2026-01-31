"use client";

import { PageWraper } from "../../hoc";
import { SelectInput, TextInput } from "../../components/inputs";

const FutureCropStocks = () => {
	return (
		<main className="form-container">
			<h1 className="form-heading">Future stock</h1>
			<div className="form-grid">
				<SelectInput 
					label="Crop Code"
					options={["crop-code-01","crop-code-02","crop-code-03"]}
					onChange={() => {}}
				/>
				<SelectInput
					label="Variety"
					options={["variety-01","variety-02","variety-03","variety-04"]}
					onChange={() => {}}
				/>
				<SelectInput 
					label="Season"
					options={["kharif (monsoon)", "rabi (spring)", "Zaid (summer)"]}
				/>
				<TextInput 
					label="Quantity on hold"
					onChange={() => {}}
					placeholder="0"
					type="number"
				/>
				<TextInput 
					label="Sold quantity"
					onChange={() => {}}
					placeholder="0"
					type="number"
				/>
        <TextInput 
          label="Expected harvesting date"
          onChange={() => {}}
          type="date"
        />
        <TextInput 
          label="Expected selling date"
          onChange={() => {}}
          type="date"
        />
			</div>

			<div className="form-btns-container">
				<button className="form-btn bg-gray-200 hover:bg-gray-300">Save</button>
				<button className="form-btn bg-secondary hover:bg-secondary-hover">+ Add crop plan</button>
			</div>
		</main>
	);
}

export default PageWraper(FutureCropStocks);