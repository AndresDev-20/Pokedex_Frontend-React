import './Pokeball.css'

function Pokeball({ size = "4em", text }) {
	return (
		<div className="Pokeball__wrapper" role="status">
			<div className="Pokeball" style={{ "--size": size }}>
				<div className="Pokeball__button"></div>
			</div>
			{text && <p className="Pokeball__text">{text}</p>}
		</div>
	)
}

export default Pokeball;
