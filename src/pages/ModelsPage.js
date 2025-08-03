import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const GET_MODELS = gql`
  query GetModels($id: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $id, sortBy: $sortBy) {
      id
      name
      type
      image
    }
  }
`;
const PAGE_SIZE=5;
function ModelsPage(){
    const { brandId } = useParams();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const {data, loading, error}=useQuery(GET_MODELS, {
        variables: {
            id:brandId,
            sortBy:{
                field:'name',
                order:'ASC',
            },
        },
    });

    if (loading) return <p>Loading models...</p>
    if (error) return <p>Error: {error.message}</p>;

    let filteredModels=data.findBrandModels.filter((model)=>
    model.name.toLowerCase().includes(search.toLowerCase())
    );

    if(typeFilter){
        filteredModels = filteredModels.filter((model)=>model.type === typeFilter);
    }

    const totalPages=Math.ceil(filteredModels.length/PAGE_SIZE);
    const startIndex=currentPage*PAGE_SIZE;
    const paginatedModels=filteredModels.slice(startIndex, startIndex+PAGE_SIZE);

    const goToPage=(page)=>{
        if(page>=0 && page<totalPages){
            setCurrentPage(page);
        }
    };

    return(
        <div className="container">
            <h1 style={{ textAlign: 'center' }}>Guitar Models</h1>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search models"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(0);
                    }}
                />
                <select
                    value={typeFilter}
                    onChange={(e) => {
                        setTypeFilter(e.target.value);
                        setCurrentPage(0);
                    }}
                >
                    <option value="">All types</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="ACOUSTIC">Acoustic</option>
                    <option value="BASS">Bass</option>
                </select>
            </div>

            <div className="card-grid">
                {paginatedModels.map((model) => (
                    <Link to={`/guitar/${model.id}`} state={{brandId}} key={model.id}  className="card">
                        <img src={model.image } alt={model.name} />
                        <div className="card-title">{model.name}</div>
                        <div className="card-subtitle">{model.type}</div>
                    </Link>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>
      Page {currentPage + 1} of {totalPages}
    </span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
                    Next
                </button>
            </div>
        </div>

    );
}


export default ModelsPage;
