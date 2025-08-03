import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_BRANDS = gql`
 query{
    findAllBrands{
        id
        name
        image
        }
    }   
`;

function BrandsPage() {
    const { data, loading, error } = useQuery(GET_BRANDS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading brands.</p>;

    return (
        <div className="container">
            <h1>Guitar Brands</h1>
            <div className="card-grid">
                {data.findAllBrands.map((brand) => (
                    <Link to={`/brand/${brand.id}`} key={brand.id} className="card">
                        <img src={brand.image} alt={brand.name} />
                        <div className="card-title">{brand.name}</div>
                        <div className="card-subtitle">{brand.origin}</div>
                    </Link>
                ))}
            </div>
        </div>



    );
}

export default BrandsPage;
