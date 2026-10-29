import './Pagination.css'

// Devuelve la lista de páginas a mostrar, con "…" donde se omiten páginas.
const getPages = (page, total, siblings) => {
	const pages = [];
	const start = Math.max(2, page - siblings);
	const end = Math.min(total - 1, page + siblings);

	pages.push(1);
	if (start > 2) pages.push("start-gap");
	for (let i = start; i <= end; i++) pages.push(i);
	if (end < total - 1) pages.push("end-gap");
	if (total > 1) pages.push(total);
	return pages;
};

function Pagination({ page, totalPages, onChange, siblings = 1, compact = false }) {
	if (totalPages <= 1) return null;

	const go = (p) => {
		if (p >= 1 && p <= totalPages && p !== page) onChange(p);
	};

	return (
		<nav className={`Pagination ${compact ? "Pagination--compact" : ""}`} aria-label="Paginación">
			{!compact && (
				<button className="Pagination__btn Pagination__edge" onClick={() => go(1)} disabled={page === 1} aria-label="Primera página">«</button>
			)}
			<button className="Pagination__btn Pagination__arrow" onClick={() => go(page - 1)} disabled={page === 1} aria-label="Página anterior">‹</button>

			<ul className="Pagination__pages">
				{getPages(page, totalPages, siblings).map(p =>
					typeof p === "number" ? (
						<li key={p}>
							<button
								className={`Pagination__btn Pagination__page ${p === page ? "is-active" : ""}`}
								onClick={() => go(p)}
								aria-current={p === page ? "page" : undefined}
							>
								{p}
							</button>
						</li>
					) : (
						<li key={p} className="Pagination__gap">…</li>
					)
				)}
			</ul>

			<button className="Pagination__btn Pagination__arrow" onClick={() => go(page + 1)} disabled={page === totalPages} aria-label="Página siguiente">›</button>
			{!compact && (
				<button className="Pagination__btn Pagination__edge" onClick={() => go(totalPages)} disabled={page === totalPages} aria-label="Última página">»</button>
			)}
		</nav>
	)
}

export default Pagination;
