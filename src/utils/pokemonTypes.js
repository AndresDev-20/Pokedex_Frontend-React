// Paleta y nombres en español de cada tipo de Pokémon.
export const TYPES = {
	normal: { label: "Normal", color: "#A8778A", gradient: "linear-gradient(135deg, #735259, #BC6B7C, #7C3F4C)" },
	fire: { label: "Fuego", color: "#E35825", gradient: "linear-gradient(135deg, #F96D6F, #E35825, #E8AE1B)" },
	water: { label: "Agua", color: "#1479FB", gradient: "linear-gradient(135deg, #133258, #1479FB, #82B2F1)" },
	grass: { label: "Planta", color: "#3FA86A", gradient: "linear-gradient(135deg, #7EC6C5, #6BC48E, #CAE099)" },
	electric: { label: "Eléctrico", color: "#D99A00", gradient: "linear-gradient(135deg, #0C1395, #2B319B, #7075D9)" },
	ice: { label: "Hielo", color: "#3FB4E4", gradient: "linear-gradient(135deg, #6FBEDF, #64CBF5, #BDEBFE)" },
	fighting: { label: "Lucha", color: "#D9542F", gradient: "linear-gradient(135deg, #96402A, #F1613C, #CB735D)" },
	poison: { label: "Veneno", color: "#9B55DB", gradient: "linear-gradient(135deg, #5B3184, #A564E3, #CE9BFF)" },
	ground: { label: "Tierra", color: "#A8701F", gradient: "linear-gradient(135deg, #654008, #895C1A, #D69638)" },
	flying: { label: "Volador", color: "#6C9FD8", gradient: "linear-gradient(135deg, #7BA7DC, #A9C8F0, #D9F2FD)" },
	psychic: { label: "Psíquico", color: "#C23867", gradient: "linear-gradient(135deg, #971B45, #C23867, #CD7D98)" },
	bug: { label: "Bicho", color: "#3BB039", gradient: "linear-gradient(135deg, #62DB60, #3BB039, #AAFFA8)" },
	rock: { label: "Roca", color: "#8D8D94", gradient: "linear-gradient(135deg, #7E7E7E, #8D8D94, #D3D3D3)" },
	ghost: { label: "Fantasma", color: "#5A5FC4", gradient: "linear-gradient(135deg, #323569, #454AA8, #787DDA)" },
	dragon: { label: "Dragón", color: "#478A93", gradient: "linear-gradient(135deg, #478A93, #56A4AE, #A2BEC1)" },
	dark: { label: "Siniestro", color: "#3A3F3E", gradient: "linear-gradient(135deg, #030706, #0D1211, #5A5E5D)" },
	steel: { label: "Acero", color: "#5E7F76", gradient: "linear-gradient(135deg, #5E736C, #728881, #A8A8A8)" },
	fairy: { label: "Hada", color: "#E06DB5", gradient: "linear-gradient(135deg, #C9579D, #EE99D0, #FFD1EC)" },
};

const DEFAULT_TYPE = { label: "Desconocido", color: "#777", gradient: "linear-gradient(135deg, #888, #bbb)" };

export const getType = (name) => TYPES[name] || DEFAULT_TYPE;

export const STAT_LABELS = {
	hp: "PS",
	attack: "Ataque",
	defense: "Defensa",
	"special-attack": "At. Esp.",
	"special-defense": "Def. Esp.",
	speed: "Velocidad",
};

export const formatId = (id) => `#${String(id).padStart(3, "0")}`;

export const getArtwork = (pokemon, shiny = false) => {
	const art = pokemon?.sprites?.other?.["official-artwork"];
	return (shiny ? art?.front_shiny : art?.front_default) || pokemon?.sprites?.front_default || "";
};
