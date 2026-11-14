import { HeartIcon } from "./Icons";
import StarRating from "./StarRating";

export default function PlaceCard({
  place,
  favorite,
  onToggleFavorite,
  onOpen,
}) {
  return (
    <article
      className="place-card"
      onClick={() => onOpen(place)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen(place);
      }}
      role="button"
      tabIndex="0"
    >
      <div className="place-image-wrap">
        <img
          src={place.image}
          alt={`Imagem de ${place.name}`}
          className="place-image"
        />
      </div>
      <div className="place-content">
        <div>
          <h3>{place.name}</h3>
          <p className="place-address">{place.address}</p>
          <StarRating rating={place.rating} reviews={place.reviews} />
        </div>
        <div className="card-actions">
          <button
            type="button"
            className={`favorite-button ${favorite ? "active" : ""}`}
            aria-label={
              favorite
                ? `Remover ${place.name} dos favoritos`
                : `Adicionar ${place.name} aos favoritos`
            }
            aria-pressed={favorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(place.id);
            }}
          >
            <HeartIcon filled={favorite} />
          </button>
          <button
            type="button"
            className="details-button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(place);
            }}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
