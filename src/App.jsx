import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import ListPokedex from "./pages/Pokemones/ListPokedex";
import PokemonId from "./pages/PokemonInfo/PokemonId";
import ScrollTop from "./components/ScrollTop/ScrollTop";

function App() {
  const location = useLocation();

  return (
    <>
      {/* La key reinicia la animación de entrada cada vez que cambia la ruta */}
      <div className="page" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home/>} />
          <Route path="/pokedex/:name" element={<ListPokedex/>} />
          <Route path="/pokemon/:id" element={<PokemonId/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ScrollTop />
    </>
  );
};

export default App;
