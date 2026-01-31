export default function StudentSearch({ searchId, setSearchId, onSearch }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search by Student ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={onSearch}>Load Student</button>
    </div>
  );
}
