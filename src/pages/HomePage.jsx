import { SearchIcon } from "../components/Icons";
import PlaceCard from "../components/PlaceCard";

export default function HomePage({
  query,
  setQuery,
  onlyFavorites,
  setOnlyFavorites,
  places,
  favorites,
  onToggleFavorite,
  onOpen,
  loading,
  error,
  onRetry,
}) {
  return (
    <main className="main-content">
      <section className="welcome" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Bem-vindo ao Mobisi</h1>
        <p className="welcome-copy">
          Encontre lugares acessíveis que combinam com você
        </p>
      </section>
      <section className="places-section" aria-labelledby="places-title">
        <div className="section-heading">
          <h2 id="places-title">Lugares para você</h2>
          <div className="filters" role="search">
            <label className="search-box">
              <SearchIcon />
              <span className="sr-only">Pesquisar lugar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar lugar"
              />
            </label>
            <label className="toggle-control">
              <span>Apenas favoritos</span>
              <input
                type="checkbox"
                checked={onlyFavorites}
                onChange={(event) => setOnlyFavorites(event.target.checked)}
              />
              <span className="toggle" aria-hidden="true">
                <span />
              </span>
            </label>
          </div>
        </div>
        {loading ? (
          <div className="page-state">
            <p>Carregando lugares…</p>
          </div>
        ) : error ? (
          <div className="empty-state error-state">
            <h3>Não foi possível carregar os lugares</h3>
            <p>{error}</p>
            <button type="button" onClick={onRetry}>
              Tentar novamente
            </button>
          </div>
        ) : places.length > 0 ? (
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                favorite={favorites.has(place.id)}
                onToggleFavorite={onToggleFavorite}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="bx bx-search-alt-2 empty-icon" aria-hidden="true" />
            <h3>Nenhum lugar encontrado</h3>
            <p>
              Tente buscar por outro nome ou desative o filtro de favoritos.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
