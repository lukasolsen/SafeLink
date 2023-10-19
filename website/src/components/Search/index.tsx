import { useEffect, useState } from "react";

type SearchProps = {
  onSearch: (value: string) => void;
  placeholder?: string;
};

const Search: React.FC<SearchProps> = ({ onSearch, placeholder }) => {
  const [search, setSearch] = useState<string>("");

  // filter the data
  useEffect(() => {
    onSearch(search);
  }, [search, onSearch]);

  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex flex-row items-center">
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          className="p-1 rounded-md dark:bg-dark-bg dark:text-white select-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
