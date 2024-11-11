import { useEffect, useState } from 'react';
import './PokeinfoId.css'

function PokeInfoId({ Data }) {
	const [background, setBackground] = useState("");
	const [colors, setColors] = useState("");
	const type = Data?.types[0].type.name

	const [widthUnit, setWidthUnit] = useState('%');

	useEffect(() => {
	  const handleResize = () => {
		const mediaQuery = window.matchMedia('(max-width: 599px)');
		if (mediaQuery.matches) {
		  setWidthUnit('%'); 
		} else {
		  setWidthUnit('mm'); 
		}
	  };
	  handleResize();
	  window.addEventListener('resize', handleResize);
	  return () => window.removeEventListener('resize', handleResize);
	}, []);
  

	const typeColors = {
		fire: "#E35825",
		grass: "#ABDAC6",
		electric: "#2B319B",
		normal: "#BC6B7C",
		fighting: "#F1613C",
		flying: "#D9F2FD",
		poison: "#A564E3",
		ground: "#895C1A",
		rock: "#8D8D94",
		bug: "#3BB039",
		ghost: "#454AA8",
		steel: "#728881",
		water: "#1479FB",
		psychic: "#C23867",
		ice: "#64CBF5",
		dragon: "#56A4AE",
		dark: "#0D1211",
		fairy: "#0D1211",
		default: "#ffffff",
	  };
	useEffect(() => {
		if (type === "fire") {
		  setBackground("linear-gradient(#F96D6F, #E35825, #E8AE1B)");
		  setColors("#E35825")
		} else if (type === "grass") {
		  setBackground("linear-gradient(#7EC6C5, #ABDAC6, #CAE099)");
		  setColors("#ABDAC6")
		} else if (type === "electric") {
		  setBackground("linear-gradient(#0C1395, #2B319B, #7075D9)");
		  setColors("#2B319B")
		} else if (type === "normal") {
		  setBackground("linear-gradient(#735259, #BC6B7C, #7C3F4C)");
		  setColors("#BC6B7C")
		} else if (type === "fighting") {
		    setBackground("linear-gradient(#96402A, #F1613C, #CB735D)");
		  setColors("#F1613C")
		} else if (type === "flying") {
		  setBackground("#D9F2FD");
		  setColors("D9F2FD")
		} else if (type === "poison") {
			setBackground("linear-gradient(#5B3184, #A564E3, #CE9BFF)");
			setColors("#A564E3")
		} else if (type === "ground") {
			setBackground("linear-gradient(#654008, #895C1A, #D69638)");
			setColors("#895C1A")
		} else if (type === "rock") {
			setBackground("linear-gradient(#7E7E7E, #8D8D94, #D3D3D3)");
			setColors("#8D8D94")
		} else if (type === "bug") {
			setBackground("linear-gradient(#62DB60, #3BB039, #AAFFA8)");
			setColors("#3BB039")
		} else if (type === "ghost") {
			setBackground("linear-gradient(#323569, #454AA8, #787DDA)");
			setColors("#454AA8")
		} else if (type === "steel") {
			setBackground("linear-gradient(#5E736C, #728881, #A8A8A8)");
			setColors("#728881")
		} else if (type === "water") {
		  setBackground("linear-gradient(#133258, #1479FB, #82B2F1)");
		  setColors("#1479FB")
		} else if (type === "psychic") {
			setBackground("linear-gradient(#971B45, #C23867, #CD7D98)");
			setColors("#C23867")
		} else if (type === "ice") {
			setBackground("linear-gradient(#6FBEDF, #64CBF5, #BDEBFE)");
			setColors("#64CBF5")
		} else if (type === "dragon") {
			setBackground("linear-gradient(#478A93, #56A4AE, #A2BEC1)");
			setColors("#56A4AE")
		} else if (type === "dark") {
			setBackground("linear-gradient(#030706, #0D1211, #5A5E5D)");
			setColors("#0D1211")
		} else if (type === "fairy") {
			setBackground("linear-gradient(#030706, #0D1211, #5A5E5D)");
			setColors("#0D1211")
		} else {
		  setBackground("#ffffff");
		}
	  }, [type]);

console.log(colors)
	return (
		<div className='PokeInfoIdf'>
			<div className='PokeInfoIdf__Header' style={{background: `${background}`}}>
				<figure className='PokeInfoIdf__figure'>
					<img src={Data?.sprites.other["official-artwork"].front_default} alt="" />
				</figure>
			</div>

			<div className='PokeInfoIdf__info'>
				<h1 className='PokeInfoIdf__id'>#{Data?.id}</h1>
				<ul className='PokeInfoIdf__titles'>
					<li className='PokeInfoIdf__Title-one'></li>
					<li style={{color: `${colors}`}} className='PokeInfoIdf__Title-two'>{Data?.name}</li>
					<li className='PokeInfoIdf__Title-one'></li>
				</ul>
				<ul className='PokeInfoIdf__dates'>
					<li><span className='info_title'>Peso</span> <span>{Data?.weight}</span></li>
					<li><span className='info_title'>Altura</span> <span>{Data?.height}</span></li>
				</ul>
				<div className='PokeInfoIdf__TypeHability'>
					<div>
						<h1>Tipo</h1>
						<ul className='PokeInfoIdf__TypeHability-ul type'>
							{
								Data?.types.map(Type => (
										<li style={{ backgroundColor: typeColors[Type.type.name] || typeColors.default, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }} key={Type.slot}>{Type.type.name}</li>
								))
							}
						</ul>
					</div>
						<div>
						<h1>Habilidades</h1>
						<ul className='PokeInfoIdf__TypeHability-ul habi'>
							{
								Data?.abilities.map(Habili => (
										<li key={Habili.slot}>{Habili.ability.name}</li>
								))
							}
						</ul>
					</div>
				</div>
			</div>

			<div className='PokeIndoId__stats'>
				<ul className='PokeIndoId__stats-ul'>
					<li className='PokeIndoId__stats-title'>Stats</li>
					<li className='PokeIndoId__stats-raya'></li>
					<img src="../../../../image/logo-white.png" alt="" />
				</ul>
				<div className='Stats-Pokes'>
					{
					Data?.stats.map(stat => (
						<div className='PokeIndoId__stats-stat'>
							<div className='PokeIndoId__stats-titles'>
								<h1>{stat.stat.name}</h1>
								<h1><span>{stat.base_stat}</span>/<span>150</span> </h1>
							</div>
							<div className='PokeIndoId__stats-barra'>
								<div style={{width: `${stat.base_stat}${widthUnit}`}}></div>
							</div>
						</div>
					))
				}
				</div>
				
			</div>

		</div>
	)
}

export default PokeInfoId;