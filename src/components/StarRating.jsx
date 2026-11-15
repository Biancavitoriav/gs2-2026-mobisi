function normalizeRating(rating) {
  const numericRating = Number.parseFloat(String(rating).replace(",", "."));

  if (!Number.isFinite(numericRating)) return 0;
  return Math.min(5, Math.max(0, numericRating));
}

export function Stars({ rating = 0 }) {
  const normalizedRating = normalizeRating(rating);

  return (
    <span className="stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          className="star"
          key={star}
          style={{ "--star-fill": `${Math.min(1, Math.max(0, normalizedRating - star + 1)) * 100}%` }}
        >
          <i className="bx bx-star" />
          <span className="star-fill">
            <i className="bxf bx-star" />
          </span>
        </span>
      ))}
    </span>
  );
}

export default function StarRating({ rating, reviews }) {
  return (
    <div
      className="rating"
      aria-label={`${rating} de 5 estrelas, ${reviews} avaliações`}
    >
      <Stars rating={rating} />
      <span className="review-count">({reviews})</span>
    </div>
  );
}
