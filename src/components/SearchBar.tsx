import React from 'react';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  placeholder = "지역 또는 마켓 이름을 검색하세요...",
  value = '',
  className,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className={`mb-6 w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition duration-150 ease-in-out"
        aria-label="지역 또는 마켓 이름 검색"
      />
    </div>
  );
};

export default SearchBar;