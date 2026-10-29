import { useEffect, useState } from "react";
import './ScrollTop.css'

function ScrollTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 500);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<button
			className={`ScrollTop ${visible ? "is-visible" : ""}`}
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			aria-label="Volver arriba"
		>
			<span className="ScrollTop__ball"></span>
		</button>
	)
}

export default ScrollTop;
