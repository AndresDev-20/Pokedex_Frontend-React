import axios from "axios";
import { useEffect, useState } from "react";

const Apiurl = import.meta.env.VITE_REACT_APP_URL;
const api = axios.create({ baseURL: Apiurl });

// Las peticiones se guardan en memoria para no repetirlas al paginar o volver atrás.
let listCache = null;
const typeCache = new Map();
const pokemonCache = new Map();
const speciesCache = new Map();

const getIdFromUrl = (url) => Number(url.split("/").filter(Boolean).pop());

// Los ids mayores a 10000 son formas alternativas (megas, gigamax...), se excluyen del listado.
const toBasicList = (items) =>
	items
		.map(p => ({ name: p.name, id: getIdFromUrl(p.url) }))
		.filter(p => p.id < 10000);

const cached = (cache, key, request) => {
	if (!cache.has(key)) {
		cache.set(key, request().catch(err => {
			cache.delete(key);
			throw err;
		}));
	}
	return cache.get(key);
};

export const fetchPokemonList = () => {
	if (!listCache) {
		listCache = api.get("pokemon?limit=100000&offset=0")
			.then(res => toBasicList(res.data.results))
			.catch(err => {
				listCache = null;
				throw err;
			});
	}
	return listCache;
};

export const fetchTypeNames = (type) =>
	cached(typeCache, type, () =>
		api.get(`type/${type}`).then(res => new Set(toBasicList(res.data.pokemon.map(p => p.pokemon)).map(p => p.name)))
	);

export const fetchPokemon = (id) =>
	cached(pokemonCache, String(id), () => api.get(`pokemon/${id}`).then(res => res.data));

export const fetchSpecies = (id) =>
	cached(speciesCache, String(id), () => api.get(`pokemon-species/${id}`).then(res => res.data));

const useApiPokedex = () => {
	const [Datos, setDatos] = useState(null);
	const [error, setError] = useState(null);

	const PokedexApi = () => {
		setError(null);
		fetchPokemonList()
			.then(setDatos)
			.catch(err => setError(err));
	};

	useEffect(() => {
		PokedexApi();
	}, []);

	return { PokedexApi, Datos, error };
};

export default useApiPokedex;
