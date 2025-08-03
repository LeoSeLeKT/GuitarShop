import React, { useState } from "react";
import { useParams , useLocation} from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_MODEL_DETAILS = gql`
  query GetModelDetails($brandId: ID!, $modelId: ID!) {
    findUniqueModel(brandId: $brandId, modelId: $modelId) {
      id
      name
      description
      type
      image
      price
      specs {
        bodyWood
        neckWood
        fingerboardWood
        pickups
        tuners
        scaleLength
        bridge
      }
      musicians {
        name
        musicianImage
        bands
      }
    }
  }
`;

const GuitarDetailsPage = () => {
    const {  modelId } = useParams();
    const location=useLocation();
    const brandId=location.state?.brandId;
    const { data, loading, error } = useQuery(GET_MODEL_DETAILS, {
        variables: { brandId, modelId },
    });

    const [activeTab, setActiveTab] = useState("specs");
    const [musicianIndex, setMusicianIndex] = useState(0);

    if (loading) return <p>Loading guitar details...</p>;
    if (error) return <p>Error loading details.</p>;

    const guitar = data.findUniqueModel;
    if (!guitar) return <p>No data found for this guitar.</p>;

    const visibleMusicians = guitar.musicians.slice(0, musicianIndex + 2);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
            <h1>{guitar.name}</h1>
            <img
                src={guitar.image}
                alt={guitar.name}
                style={{ maxWidth: "300px", marginBottom: "1rem" }}
            />
            <p><strong>Type:</strong> {guitar.type}</p>
            <p><strong>Price:</strong> ${guitar.price}</p>
            <p>{guitar.description}</p>

            <div style={{ marginTop: "2rem" }}>
                <button onClick={() => setActiveTab("specs")}>
                    Specs
                </button>
                <button onClick={() => setActiveTab("musicians")}>
                    Musicians
                </button>
            </div>

            <div style={{ marginTop: "1rem" }}>
                {activeTab === "specs" && (
                    <ul>
                        <li><strong>Body Wood:</strong> {guitar.specs.bodyWood}</li>
                        <li><strong>Neck Wood:</strong> {guitar.specs.neckWood}</li>
                        <li><strong>Fingerboard Wood:</strong> {guitar.specs.fingerboardWood}</li>
                        <li><strong>Pickups:</strong> {guitar.specs.pickups}</li>
                        <li><strong>Tuners:</strong> {guitar.specs.tuners}</li>
                        <li><strong>Scale Length:</strong> {guitar.specs.scaleLength}</li>
                        <li><strong>Bridge:</strong> {guitar.specs.bridge}</li>
                    </ul>
                )}

                {activeTab === "musicians" && (
                    <div>
                        {visibleMusicians.map((musician, index) => (
                            <div key={index} style={{ marginBottom: "1rem" }}>
                                <img
                                    src={musician.musicianImage}
                                    alt={musician.name}
                                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                />
                                <p><strong>{musician.name}</strong></p>
                                <p>Bands: {musician.bands.join(", ")}</p>
                            </div>
                        ))}
                        {musicianIndex + 2 < guitar.musicians.length && (
                            <button onClick={() => setMusicianIndex(musicianIndex + 2)}>
                                Show more
                            </button>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default GuitarDetailsPage;
