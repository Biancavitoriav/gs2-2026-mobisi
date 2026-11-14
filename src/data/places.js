const fallbackImage = "https://picsum.photos/seed/mobisi-local/800/600";

const formatRating = (rating) =>
  Number.isFinite(Number(rating))
    ? Number(rating).toFixed(1).replace(".", ",")
    : "0,0";

export function mapPlaceSummary(place) {
  return {
    id: place.id,
    name: place.nome,
    address: place.endereco_resumido || place.endereco,
    image: place.imagem_url || fallbackImage,
    rating: formatRating(place.nota),
    reviews: place.total_avaliacoes || 0,
    tag: place.categoria || "",
  };
}

export function mapPlaceDetails(place) {
  return {
    ...mapPlaceSummary(place),
    address: place.endereco || place.endereco_resumido,
    phone: place.telefone || "",
    website: place.site_url || "",
    accessibility: place.acessibilidade || [],
    historicalAccessibility: place.acessibilidade_historica || {},
  };
}
