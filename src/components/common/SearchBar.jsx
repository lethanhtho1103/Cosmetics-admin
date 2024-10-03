import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, handleSearch, placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        value={searchTerm}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
};

export default SearchBar;
