import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import client from "./apolloClient";
import "./style.css"

import BrandsPage from "./pages/BrandsPage";
import ModelsPage from "./pages/ModelsPage";
import GuitarDetailsPage from "./pages/GuitarDetailsPage";


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<BrandsPage />}/>
            <Route path="/brand/:brandId" element={<ModelsPage />}/>
            <Route path="/guitar/:modelId" element={<GuitarDetailsPage />} />
        </Routes>
      </Router>
    </ApolloProvider>

  );
}


export default App;
