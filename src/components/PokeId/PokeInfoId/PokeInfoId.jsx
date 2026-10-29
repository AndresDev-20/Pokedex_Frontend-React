import { useEffect, useState } from 'react';
import './PokeinfoId.css'
import { STAT_LABELS, formatId, getArtwork, getType } from '../../../utils/pokemonTypes';

// Número que sube desde 0 hasta su valor final.
function CountUp({ value, duration = 900 }) {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		let frame;
		const start = performance.now();
		const tick = (now) => {
			const progress = Math.min((now - start) / duration, 1);
			setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
			if (progress < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [value, duration]);

	return current;
}

const getSpanish = (entries = [], key) =>
	(entries.find(e => e.language.name === "es") || entries.find(e => e.language.name === "en"))?.[key];

function PokeInfoId({ Data, Species }) {
	const [shiny, setShiny] = useState(false);
	const [playing, setPlaying] = useState(false);
	const { color, gradient } = getType(Data.types[0].type.name);

	const description = getSpanish(Species?.flavor_text_entries, "flavor_text")?.replace(/[\f\n\r]/g, " ");
	const genus = getSpanish(Species?.genera, "genus");
	const total = Data.stats.reduce((sum, s) => sum + s.base_stat, 0);
	const cry = Data.cries?.latest || Data.cries?.legacy;

	const playCry = () => {
		if (!cry) return;
		const audio = new Audio(cry);
		audio.volume = .35;
		setPlaying(true);
		audio.onended = () => setPlaying(false);
		audio.play().catch(() => setPlaying(false));
	};

	return (
		<div className='PokeInfoIdf' style={{ "--type-color": color, "--type-gradient": gradient }}>
			<div className='PokeInfoIdf__Header'>
				<span className='PokeInfoIdf__ring'></span>
				<span className='PokeInfoIdf__ring two'></span>
				<div className='PokeInfoIdf__tools'>
					<button
						className={`PokeInfoIdf__tool ${shiny ? "is-active" : ""}`}
						onClick={() => setShiny(s => !s)}
						title="Ver versión shiny"
					>
						✨ Shiny
					</button>
					{cry && (
						<button className={`PokeInfoIdf__tool ${playing ? "is-active" : ""}`} onClick={playCry} title="Escuchar su grito">
							{playing ? "🔊" : "🔈"} Grito
						</button>
					)}
				</div>
				<figure className='PokeInfoIdf__figure'>
					<img key={shiny} src={getArtwork(Data, shiny)} alt={Data.name} />
				</figure>
			</div>

			<div className='PokeInfoIdf__info'>
				<h1 className='PokeInfoIdf__id'>{formatId(Data.id)}</h1>
				<ul className='PokeInfoIdf__titles'>
					<li className='PokeInfoIdf__Title-one'></li>
					<li className='PokeInfoIdf__Title-two'>{Data.name.replace(/-/g, " ")}</li>
					<li className='PokeInfoIdf__Title-one'></li>
				</ul>
				{genus && <p className='PokeInfoIdf__genus'>{genus}</p>}
				{description && <p className='PokeInfoIdf__description'>“{description}”</p>}

				<ul className='PokeInfoIdf__dates'>
					<li><span className='info_title'>Peso</span> <span>{Data.weight / 10} kg</span></li>
					<li><span className='info_title'>Altura</span> <span>{Data.height / 10} m</span></li>
					<li><span className='info_title'>Exp. base</span> <span>{Data.base_experience ?? "—"}</span></li>
				</ul>

				<div className='PokeInfoIdf__TypeHability'>
					<div>
						<h1>Tipo</h1>
						<ul className='PokeInfoIdf__TypeHability-ul type'>
							{Data.types.map((Type, i) => (
								<li style={{ backgroundColor: getType(Type.type.name).color, "--i": i }} key={Type.slot}>
									{getType(Type.type.name).label}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h1>Habilidades</h1>
						<ul className='PokeInfoIdf__TypeHability-ul habi'>
							{Data.abilities.map((Habili, i) => (
								<li key={Habili.ability.name} style={{ "--i": i }} title={Habili.is_hidden ? "Habilidad oculta" : undefined}>
									{Habili.ability.name.replace(/-/g, " ")}
									{Habili.is_hidden && <small> (oculta)</small>}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className='PokeIndoId__stats'>
				<ul className='PokeIndoId__stats-ul'>
					<li className='PokeIndoId__stats-title'>Stats</li>
					<li className='PokeIndoId__stats-raya'></li>
					<li className='PokeIndoId__ball' aria-hidden="true"></li>
				</ul>
				<div className='Stats-Pokes'>
					{Data.stats.map((stat, i) => (
						<div className='PokeIndoId__stats-stat' key={stat.stat.name} style={{ "--i": i }}>
							<div className='PokeIndoId__stats-titles'>
								<h1>{STAT_LABELS[stat.stat.name] || stat.stat.name}</h1>
								<h1><span><CountUp value={stat.base_stat} /></span>/<span>255</span></h1>
							</div>
							<div className='PokeIndoId__stats-barra'>
								<div style={{ width: `${Math.min(stat.base_stat / 180, 1) * 100}%` }}></div>
							</div>
						</div>
					))}
					<div className='PokeIndoId__stats-total'>
						<span>Total</span>
						<strong><CountUp value={total} duration={1200} /></strong>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PokeInfoId;
