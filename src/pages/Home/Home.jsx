import React from "react";
import './Home.css'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.BASE_URL;

// Pokébolas decorativas que flotan en el fondo: [tamaño, izquierda, duración, retraso].
const BUBBLES = [
	[3, 8, 14, 0], [1.6, 22, 11, 3], [4.5, 38, 18, 6], [2, 55, 12, 1],
	[3.4, 70, 16, 4], [1.4, 82, 10, 7], [2.6, 92, 15, 2], [1.8, 48, 13, 9],
];

function Home(){
	const {handleSubmit, register, formState: { errors }} = useForm()
	const navigate = useNavigate();
	const savedName = localStorage.getItem("Name");

	const submit = (data) => {
		const name = data.Name.trim();
		localStorage.setItem("Name", name)
		navigate(`/pokedex/${name}`)
	}

	return (
		<section className="Home">
			<div className="Home__bg" style={{ backgroundImage: `url(${BASE}image/Image1.jpg)` }}></div>
			<div className="Home__bubbles" aria-hidden="true">
				{BUBBLES.map(([size, left, duration, delay], i) => (
					<span key={i} style={{ "--size": `${size}em`, left: `${left}%`, "--duration": `${duration}s`, "--delay": `${delay}s` }}></span>
				))}
			</div>

			<article className="Home__container">
				<figure className="Home__container-figure">
					<img className="Image2" src={`${BASE}image/Podex.png`} alt="Pokédex" />
				</figure>

				<div className="Home__container-info">
					<h1>¡Hola Entrenador!</h1>
					<form className="Home__form" onSubmit={handleSubmit(submit)}>
						<label htmlFor="trainer-name">Para empezar dame tu nombre:</label>
						<div className="Home__input">
							<input
								id="trainer-name"
								{...register("Name", { required: true, validate: v => v.trim().length >= 2 })}
								type="text"
								placeholder="Ej: Ash Ketchum"
								autoComplete="off"
								className={errors.Name ? "has-error" : ""}
							/>
						</div>
						{errors.Name && <span className="Home__error">Escribe al menos 2 letras ✋</span>}
						<button className="Home__button">
							<span>Comenzar</span>
						</button>
						{savedName && (
							<button type="button" className="Home__continue" onClick={() => navigate(`/pokedex/${savedName}`)}>
								Continuar como <strong>{savedName}</strong> →
							</button>
						)}
					</form>
					<p className="text">
					Que nuestras vidas sean como la de Ash y Pikachu: llenas de aventuras, amistad y sueños por alcanzar.
					</p>
				</div>
			</article>

			<footer className="Home__Footer">
				<div>
					<div className="Footer__bola">
						<div className="Footer__bola2"></div>
					</div>
				</div>
			</footer>
		</section>
	);
};

export default Home;
