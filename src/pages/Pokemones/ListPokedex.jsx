import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useApiPokedex, { fetchPokemon, fetchTypeNames } from "../../Hooks/useApiPokedex";
import Header from "../../components/Header/Header";
import './ListPokedex.css';
import Pokemones from "../../components/PokedexPerson/Pokemones";
import Pagination from "../../components/Pagination/Pagination";
import Pokeball from "../../components/Loader/Pokeball";
import { TYPES } from "../../utils/pokemonTypes";

const PER_PAGE_OPTIONS = [12, 24, 48];

function ListPokedex() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { PokedexApi, Datos, error } = useApiPokedex();
    const [params, setParams] = useSearchParams();

    // El estado de la lista vive en la URL (?page=2&type=fire&q=pika) para poder compartirla y volver atrás.
    const type = params.get("type") || "";
    const query = params.get("q") || "";
    const perPage = PER_PAGE_OPTIONS.includes(Number(params.get("limit"))) ? Number(params.get("limit")) : 24;
    const page = Math.max(1, Number(params.get("page")) || 1);

    const [search, setSearch] = useState(query);
    const [typeNames, setTypeNames] = useState({ type: "", names: null });
    const [pokemon, setPokemon] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const gridRef = useRef(null);
    const prevPage = useRef(null);
    const ownQuery = useRef(query);

    const updateParams = (changes, replace = false) => {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined || (key === "page" && value === 1)) next.delete(key);
            else next.set(key, value);
        });
        setParams(next, { replace });
    };

    // Búsqueda en vivo con un pequeño retraso para no recalcular en cada tecla.
    useEffect(() => {
        if (search.trim() === query) return;
        const timer = setTimeout(() => {
            ownQuery.current = search.trim();
            updateParams({ q: search.trim(), page: 1 }, true);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Si la búsqueda cambia desde fuera (botón atrás del navegador), se refleja en el input.
    useEffect(() => {
        if (query !== ownQuery.current) {
            ownQuery.current = query;
            setSearch(query);
        }
    }, [query]);

    useEffect(() => {
        if (!type) return;
        let active = true;
        fetchTypeNames(type)
            .then(names => active && setTypeNames({ type, names }))
            .catch(err => console.log(err));
        return () => { active = false; };
    }, [type]);

    const typeReady = !type || typeNames.type === type;

    const filtered = useMemo(() => {
        if (!Datos || !typeReady) return [];
        const term = query.toLowerCase().replace("#", "").trim();
        return Datos.filter(p => {
            if (type && !typeNames.names.has(p.name)) return false;
            if (!term) return true;
            return /^\d+$/.test(term) ? String(p.id).startsWith(term) : p.name.includes(term);
        });
    }, [Datos, type, typeNames, typeReady, query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
    const pageKey = pageItems.map(p => p.id).join(",");

    // Solo se piden los detalles de los Pokémon de la página actual.
    useEffect(() => {
        if (!Datos || !typeReady) return;
        let active = true;
        setLoadingPage(true);
        Promise.allSettled(pageItems.map(p => fetchPokemon(p.id)))
            .then(results => {
                if (!active) return;
                setPokemon(results.filter(r => r.status === "fulfilled").map(r => r.value));
                setLoadingPage(false);
            });
        return () => { active = false; };
    }, [pageKey, Datos, typeReady]);

    useEffect(() => {
        // Mientras carga la lista la página calculada no es la real, así que no se hace scroll.
        if (!Datos || !typeReady) return;
        if (prevPage.current !== null && prevPage.current !== currentPage) {
            gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        prevPage.current = currentPage;
    }, [currentPage, Datos, typeReady]);

    const goToPage = (p) => updateParams({ page: p });

    // Flechas del teclado para cambiar de página.
    useEffect(() => {
        const onKey = (e) => {
            if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
            if (e.key === "ArrowRight" && currentPage < totalPages) goToPage(currentPage + 1);
            if (e.key === "ArrowLeft" && currentPage > 1) goToPage(currentPage - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    const volver = () => {
        localStorage.removeItem("Name");
        navigate("/");
    };

    const clearFilters = () => {
        setSearch("");
        setParams({}, { replace: true });
    };

    const loading = !Datos || !typeReady || loadingPage;
    const from = filtered.length ? (currentPage - 1) * perPage + 1 : 0;
    const to = Math.min(currentPage * perPage, filtered.length);

    return (
        <section className="ListPokedex">
            <div className="ListPokedex__header">
                <Header>
                    <button className="Header__btn" onClick={volver}>⏻ Salir</button>
                </Header>
            </div>

            <div className="ListPokedex__info">
                <h1 className="ListPokedex__info-h1">
                    <span>Bienvenido {name},</span> aquí podrás encontrar tu Pokémon favorito
                </h1>

                <div className="ListPokedex__filters">
                    <div className="ListPokedex__search">
                        <span className="ListPokedex__search-icon">🔎</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Busca por nombre o número..."
                            aria-label="Buscar Pokémon"
                        />
                        {search && (
                            <button className="ListPokedex__search-clear" onClick={() => setSearch("")} aria-label="Limpiar búsqueda">✕</button>
                        )}
                    </div>

                    <label className="ListPokedex__perpage">
                        Mostrar
                        <select value={perPage} onChange={e => updateParams({ limit: e.target.value, page: 1 })}>
                            {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </label>
                </div>

                <div className="ListPokedex__types" role="group" aria-label="Filtrar por tipo">
                    <button
                        className={`TypeChip ${!type ? "is-active" : ""}`}
                        style={{ "--chip": "#E3350D", "--i": 0 }}
                        onClick={() => updateParams({ type: "", page: 1 })}
                    >
                        Todos
                    </button>
                    {Object.entries(TYPES).map(([key, t], i) => (
                        <button
                            key={key}
                            className={`TypeChip ${type === key ? "is-active" : ""}`}
                            style={{ "--chip": t.color, "--i": i + 1 }}
                            onClick={() => updateParams({ type: type === key ? "" : key, page: 1 })}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="ListPokedex__summary" ref={gridRef}>
                    {Datos && typeReady && (
                        <p key={`${type}-${query}-${currentPage}`}>
                            {filtered.length
                                ? <>Mostrando <strong>{from}–{to}</strong> de <strong>{filtered.length}</strong> Pokémon</>
                                : "Sin resultados"}
                        </p>
                    )}
                    {(type || query) && (
                        <button className="ListPokedex__clear" onClick={clearFilters}>Limpiar filtros</button>
                    )}
                </div>
            </div>

            {error ? (
                <div className="ListPokedex__empty">
                    <Pokeball size="5em" />
                    <h2>No pudimos conectar con la Pokédex</h2>
                    <button className="ListPokedex__clear" onClick={PokedexApi}>Reintentar</button>
                </div>
            ) : !loading && filtered.length === 0 ? (
                <div className="ListPokedex__empty">
                    <div className="ListPokedex__empty-ball">?</div>
                    <h2>¡Ningún Pokémon salvaje apareció!</h2>
                    <p>Intenta con otro nombre o cambia el tipo.</p>
                    <button className="ListPokedex__clear" onClick={clearFilters}>Ver todos</button>
                </div>
            ) : (
                <>
                    <Pokemones Datos={pokemon} loading={loading} skeletons={Math.min(perPage, 12)} />
                    <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                    {totalPages > 1 && <p className="ListPokedex__hint">Tip: usa las flechas ← → del teclado para cambiar de página</p>}
                </>
            )}
        </section>
    );
}

export default ListPokedex;
