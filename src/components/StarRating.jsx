export function Stars() {
  return (
    <span className="stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <i className="bxf bx-star" key={star} />
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
      <Stars />
      <span className="review-count">({reviews})</span>
    </div>
  );
}
