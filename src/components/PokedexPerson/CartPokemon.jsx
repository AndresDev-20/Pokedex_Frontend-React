import React, { useRef, useState } from "react";
import './CartPokemon.css'
import { useLocation, useNavigate } from "react-router-dom";
import { formatId, getArtwork, getType } from "../../utils/pokemonTypes";

const STATS = [
	{ label: "HP", index: 0 },
	{ label: "ATAQUE", index: 1 },
	{ label: "DEFENSA", index: 2 },
	{ label: "VELOCIDAD", index: 5 },
];

function CartPokemon({ pokemon, index = 0 }) {
	const navigate = useNavigate();
	const location = useLocation();
	const cardRef = useRef(null);
	const [loaded, setLoaded] = useState(false);
	const { color, gradient } = getType(pokemon.types[0].type.name);

	// Inclinación 3D siguiendo el cursor; se escribe directo en variables CSS para no re-renderizar.
	const handleMove = (e) => {
		const card = cardRef.current;
		if (!card || e.pointerType !== "mouse") return;
		const rect = card.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		card.style.setProperty("--rx", `${-y * 10}deg`);
		card.style.setProperty("--ry", `${x * 12}deg`);
		card.style.setProperty("--mx", `${(x + .5) * 100}%`);
		card.style.setProperty("--my", `${(y + .5) * 100}%`);
	};

	const handleLeave = () => {
		const card = cardRef.current;
		card?.style.setProperty("--rx", "0deg");
		card?.style.setProperty("--ry", "0deg");
	};

	// Se guarda la URL del listado (con filtros y página) para que "Volver" regrese exactamente ahí.
	const navigatePokemon = () => navigate(`/pokemon/${pokemon.id}`, { state: { from: location.pathname + location.search } });

	return (
		<article
			ref={cardRef}
			className="CartPokemon"
			style={{ "--type-color": color, "--type-gradient": gradient, "--delay": `${index * 55}ms` }}
			onClick={navigatePokemon}
			onKeyDown={(e) => e.key === "Enter" && navigatePokemon()}
			onPointerMove={handleMove}
			onPointerLeave={handleLeave}
			tabIndex={0}
			role="link"
			aria-label={`Ver detalles de ${pokemon.name}`}
		>
			<div className="CartPokemon_inner">
				<div className="CartPokemon_header">
					<span className="CartPokemon_id">{formatId(pokemon.id)}</span>
					<span className="CartPokemon_ball"></span>
					<figure className="CartPokemon_info-img">
						<img
							className={loaded ? "is-loaded" : ""}
							src={getArtwork(pokemon)}
							alt={pokemon.name}
							loading="lazy"
							onLoad={() => setLoaded(true)}
						/>
					</figure>
				</div>
				<div className="CartPokemon_info">
					<div className="CartPokemon_info-titles">
						<h1>{pokemon.name.replace(/-/g, " ")}</h1>
						<div className="CartPokemon_power">
							{pokemon.types.map(({ type }) => (
								<span key={type.name} className="CartPokemon_chip" style={{ background: getType(type.name).color }}>
									{getType(type.name).label}
								</span>
							))}
						</div>
					</div>
					<ul className="CartPokemon_habilite">
						{STATS.map(({ label, index: i }) => (
							<li key={label}>
								{label}
								<span>{pokemon.stats[i].base_stat}</span>
								<div className="CartPokemon_bar">
									<div style={{ width: `${Math.min(pokemon.stats[i].base_stat / 1.6, 100)}%` }}></div>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className="CartPokemon_shine"></div>
			</div>
		</article>
	)
}

export default CartPokemon;
