const SearchBar = ({ search, onSearch }) => {
    return (
        <div className="absolute top-4 left-4 right-16 z-20">
            <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full px-4 py-2 rounded-full shadow-lg bg-white border border-gray-200 text-sm focus:outline-none"
            />
        </div>
    )
}

export default SearchBar