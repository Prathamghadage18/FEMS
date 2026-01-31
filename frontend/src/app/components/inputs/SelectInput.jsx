
const SelectInput = ({label, options, onChange, value}) => (
	<div className="flex flex-col gap-1.5">
		{label && <label className="font-semibold text-gray-700 text-sm">{label}</label>}
		<select 
			onChange={onChange}
			value={value}
			className="py-2.5 px-4 rounded-lg outline-none bg-white border border-gray-300 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer transition-all"
		>
			<option value="" disabled>Select an option</option>
			{options && options.map((opt, idx) => (
				<option key={idx} value={opt} className="py-2 px-4 bg-white text-gray-800">{opt}</option>
			))}
		</select>
	</div>
);

export default SelectInput;