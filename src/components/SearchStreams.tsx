import { useState } from "react";
import { Link } from "react-router-dom";

const SearchStreams: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/ax/search/?keywords=${encodeURIComponent(query)}`,
        {
          headers: {
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
          },
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      setResults(data.online || []);
    } catch (error) {
      console.error("Erro ao buscar streams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar lives por nome..."
          style={{ padding: "5px", marginRight: "5px" }}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Carregando...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((stream, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            <Link to={`/${stream}`}>
              {stream}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchStreams;
