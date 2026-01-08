import { Link } from "react-router-dom";
import useFetchStreams from "../hooks/useFetchStreams";
import { useState } from "react";

const categories = [
    { descritiopn: 'Featured', value: '' },
    { descritiopn: 'Female', value: 'f' },
    { descritiopn: 'Couple', value: 'c' },
    { descritiopn: 'Trans', value: 't' }
]

const StreamList: React.FC = () => {
    const [category, setCategory] = useState('');
    const { streams, loading, hasMore } = useFetchStreams(category);

    return (
        <>
            <ul style={{ display: 'flex', gap: '10px', listStyle: 'none' }}>
                {categories.map((category) => (
                    <li key={category.value} onClick={() => setCategory(category.value)} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '5px' }}>
                        <span>{category.descritiopn}</span>
                    </li>
                ))}
            </ul>
            <div>
            {streams.map((stream, index) => (
                <Link key={index} to={stream.display}>
                    <div >
                        <img src={stream.image} alt={stream.display} />
                        {stream.display}
                    </div>
                </Link>
                ))}
            {loading && <p>Carregando...</p>}
            {!hasMore && <p>Fim da lista</p>}
            </div>
        </>
    );
};
export default StreamList;