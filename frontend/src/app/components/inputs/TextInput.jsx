
const TextInput = ({label, placeholder="Enter value...", value, onChange, type="text"}) => {
	return (
		<div className="flex flex-col gap-1.5">
			{label && <label className="font-semibold text-gray-700 text-sm">{label}</label>}
			<input 
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				type={type}
				className="py-2.5 px-4 outline-none border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
			/>
		</div>
	)
}

export default TextInput;