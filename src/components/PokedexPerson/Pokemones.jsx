import React from "react";
import CartPokemon from "./CartPokemon";
import './Pokemones.css'

function SkeletonCard({ index }) {
	return (
		<article className="CartPokemon CartPokemon--skeleton" style={{ "--delay": `${index * 40}ms` }} aria-hidden="true">
			<div className="CartPokemon_inner">
				<div className="Skeleton Skeleton--header"></div>
				<div className="Skeleton Skeleton--line"></div>
				<div className="Skeleton Skeleton--line short"></div>
			</div>
		</article>
	)
}

function Pokemones({ Datos, loading, skeletons = 12 }) {
	return (
		<section className="Pokemones" aria-busy={loading}>
			{loading
				? Array.from({ length: skeletons }, (_, i) => <SkeletonCard key={i} index={i} />)
				: Datos.map((pokemon, index) => (
					<CartPokemon key={pokemon.id} pokemon={pokemon} index={index} />
				))}
		</section>
	)
};

export default Pokemones;
