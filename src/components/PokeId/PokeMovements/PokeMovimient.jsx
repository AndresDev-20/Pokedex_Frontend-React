import { useMemo, useState } from 'react';
import './Pokemovimient.css'
import Pagination from '../../Pagination/Pagination';

const PER_PAGE = 18;

const METHOD_LABELS = {
	"level-up": "Nivel",
	machine: "MT",
	egg: "Huevo",
	tutor: "Tutor",
	train: "Entreno",
};

const METHOD_PRIORITY = ["level-up", "machine", "egg", "tutor", "train"];

// De todas las generaciones, se muestra la forma más útil de aprender el movimiento.
const getLearn = (move) => {
	const details = move.version_group_details;
	const method = METHOD_PRIORITY.find(m => details.some(d => d.move_learn_method.name === m))
		|| details[details.length - 1]?.move_learn_method.name;
	const levelUp = details.filter(d => d.move_learn_method.name === "level-up");
	const level = levelUp.length ? levelUp[levelUp.length - 1].level_learned_at : 999;
	return {
		method,
		label: method === "level-up" ? `Nv. ${level}` : METHOD_LABELS[method] || "Especial",
		level,
	};
};

function PokeMovimient({ Data }) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");

	const moves = useMemo(() =>
		Data.moves
			.map(m => ({ name: m.move.name, ...getLearn(m) }))
			.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
	[Data]);

	const methods = [...new Set(moves.map(m => m.method))];

	const filtered = moves.filter(m =>
		(!filter || m.method === filter) && m.name.includes(search.toLowerCase().trim().replace(/\s+/g, "-"))
	);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
	const current = Math.min(page, totalPages);
	const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

	const changeFilter = (value) => {
		setFilter(value);
		setPage(1);
	};

	return (
		<div className='PokeMovimient'>
			<ul className='PokeIndoId__stats-ul'>
				<li className='PokeIndoId__stats-title'>Movimientos <small>({moves.length})</small></li>
				<li className='PokeIndoId__stats-raya'></li>
				<li className='PokeIndoId__ball' aria-hidden="true"></li>
			</ul>

			{moves.length > 0 && (
				<div className='Pokemovimient__tools'>
					<input
						value={search}
						onChange={e => { setSearch(e.target.value); setPage(1); }}
						placeholder='Buscar movimiento...'
						aria-label='Buscar movimiento'
					/>
					<div className='Pokemovimient__filters'>
						<button className={!filter ? "is-active" : ""} onClick={() => changeFilter("")}>Todos</button>
						{methods.map(m => (
							<button key={m} className={filter === m ? "is-active" : ""} onClick={() => changeFilter(m)}>
								{METHOD_LABELS[m] || "Especial"}
							</button>
						))}
					</div>
				</div>
			)}

			<ul className='Pokemovimient__moves' key={`${current}-${filter}-${search}`}>
				{visible.map((move, i) => (
					<li key={move.name} style={{ "--i": i }}>
						<span>{move.name.replace(/-/g, " ")}</span>
						<small className={`Pokemovimient__badge ${move.method}`}>{move.label}</small>
					</li>
				))}
				{visible.length === 0 && <li className='Pokemovimient__empty'>No hay movimientos que coincidan.</li>}
			</ul>

			<Pagination page={current} totalPages={totalPages} onChange={setPage} compact />
		</div>
	)
}

export default PokeMovimient;
