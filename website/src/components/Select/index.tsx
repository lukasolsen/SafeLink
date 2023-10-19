import { useState } from "react";

type SelectProps = {
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

const Select: React.FC<SelectProps> = ({ onChange, options }) => {
  const [selected, setSelected] = useState<string>(options[0].value);

  return (
    <select
      className="p-2 rounded-md dark:bg-dark-bg dark:text-white border border-gray-400 hover:border-gray-500 focus:border-sky-400 focus:outline-none transition duration-300"
      onChange={(e) => {
        setSelected(e.target.value);
        onChange(e.target.value);
      }}
    >
      {options.map((option) => (
        <option
          key={option.label}
          value={option.value}
          selected={option.value === selected}
          className="bg-dark-bg text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
