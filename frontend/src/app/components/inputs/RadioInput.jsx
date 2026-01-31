const RadioInput = ({ label, name, onSelect, options, value }) => {
  return (
    <div className="w-full flex flex-col gap-2 mt-1">
      {label && (
        <label className="font-semibold text-gray-700 text-sm">{label}</label>
      )}
      <div className="flex flex-wrap gap-6 py-1">
        {options &&
          options.map((option, idx) => (
            <label key={idx} className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onSelect}
                className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
      </div>
    </div>
  );
};

export default RadioInput;
