import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Header.css'

const BASE = import.meta.env.BASE_URL;

function Header({ children }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className={`Header ${scrolled ? "is-scrolled" : ""}`}>
			<div className="Header__container">
				<Link to={`/pokedex/${localStorage.getItem("Name") || "Entrenador"}`} className="Header__logo">
					<img className="Header__Image" src={`${BASE}image/Podex.png`} alt="Pokédex" />
				</Link>
				<div className="Header__actions">{children}</div>
			</div>
			<div className="Header__container2">
				<div className="Header__bola">
					<div className="Header__bola2">
						<div className="Header__bola3"></div>
					</div>
				</div>
			</div>
		</header>
	)
};

export default Header;
