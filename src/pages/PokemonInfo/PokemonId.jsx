import './PokemonId.css'
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PokeInfoId from "../../components/PokeId/PokeInfoId/PokeInfoId";
import PokeMovimient from "../../components/PokeId/PokeMovements/PokeMovimient";
import Header from "../../components/Header/Header";
import Pokeball from "../../components/Loader/Pokeball";
import { fetchPokemon, fetchPokemonList, fetchSpecies } from "../../Hooks/useApiPokedex";
import { formatId } from "../../utils/pokemonTypes";

function PokemonId() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [data, setData] = useState(null);
	const [species, setSpecies] = useState(null);
	const [error, setError] = useState(false);
	const [neighbors, setNeighbors] = useState({ prev: null, next: null });

	useEffect(() => {
		let active = true;
		setData(null);
		setSpecies(null);
		setError(false);
		window.scrollTo({ top: 0 });

		fetchPokemon(id)
			.then(res => {
				if (!active) return;
				setData(res);
				fetchSpecies(res.species.name).then(s => active && setSpecies(s)).catch(() => {});
			})
			.catch(() => active && setError(true));

		// Vecinos para navegar al anterior / siguiente sin volver al listado.
		fetchPokemonList().then(list => {
			if (!active) return;
			const index = list.findIndex(p => String(p.id) === String(id) || p.name === id);
			setNeighbors({ prev: list[index - 1] || null, next: list[index + 1] || null });
		}).catch(() => {});

		return () => { active = false; };
	}, [id]);

	useEffect(() => {
		const onKey = (e) => {
			if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
			if (e.key === "ArrowLeft" && neighbors.prev) navigate(`/pokemon/${neighbors.prev.id}`, { state: location.state });
			if (e.key === "ArrowRight" && neighbors.next) navigate(`/pokemon/${neighbors.next.id}`, { state: location.state });
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [neighbors]);

	const Volver = () => {
		// Si venimos del listado, se vuelve con los mismos filtros y página.
		navigate(location.state?.from || `/pokedex/${localStorage.getItem("Name") || "Entrenador"}`);
	};

	return (
		<section className="PokemonId">
			<header className="ListPokedex__header">
				<Header>
					<button className="Header__btn" onClick={Volver}>← Volver</button>
				</Header>
			</header>

			{error ? (
				<div className="PokemonId__error">
					<h2>Este Pokémon escapó 💨</h2>
					<p>No encontramos el Pokémon «{id}».</p>
					<button className="Header__btn" onClick={Volver}>Volver a la Pokédex</button>
				</div>
			) : !data ? (
				<div className="PokemonId__loading">
					<Pokeball size="5em" text="Atrapando Pokémon..." />
				</div>
			) : (
				<div key={data.id}>
					<nav className="PokemonId__nav">
						{neighbors.prev ? (
							<Link className="PokemonId__nav-btn" to={`/pokemon/${neighbors.prev.id}`} state={location.state}>
								<span className="PokemonId__nav-arrow">‹</span>
								<span><small>{formatId(neighbors.prev.id)}</small>{neighbors.prev.name}</span>
							</Link>
						) : <span />}
						{neighbors.next && (
							<Link className="PokemonId__nav-btn is-next" to={`/pokemon/${neighbors.next.id}`} state={location.state}>
								<span><small>{formatId(neighbors.next.id)}</small>{neighbors.next.name}</span>
								<span className="PokemonId__nav-arrow">›</span>
							</Link>
						)}
					</nav>

					<PokeInfoId Data={data} Species={species} />
					<PokeMovimient Data={data} />
				</div>
			)}
		</section>
	)
}

export default PokemonId;
