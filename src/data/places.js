const fallbackImages = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1667844313374-ebd0574ea893?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1708924908152-aa8df3576b86?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1720250600509-a310ab222bdc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1598276952428-9a9bf2645144?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1640313033260-bc6d2346d7ab?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1634751089857-7fd00eda819b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1689784626180-3ae58cba794a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1611100552804-27502ccc9e3f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1745270212888-46a89b8b51d1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1750814892580-2a0934e5482f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1589300180450-8f978d5fe43c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1677666922880-2e458267119d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1686052185706-2fb99ba29116?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1765049526513-cb3397f13f77?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1563305590-2e043a5bafa1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1739472932630-8c0f44303e9d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1761517394803-aab6df3f9095?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1742922210524-a3c0a94aaace?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1664695407494-a90bab059b28?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511942391222-ffe923680ba4?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1668315809042-1d114aed7e2f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1633111626792-9cfe817c3f8c?auto=format&fit=crop&w=900&q=85",
  "https://upload.wikimedia.org/wikipedia/commons/b/b5/Pristina_City_Park_entrance.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burnham_Park_gate_%28Baguio_City%3B_12-04-2022%29.jpg/1280px-Burnham_Park_gate_%28Baguio_City%3B_12-04-2022%29.jpg",
  "https://www.gmp.de/images/gmp_1817_02_1817_MB52_02_8457.jpg?w=1920",
  "https://fpf.ccidahk.gov.hk/common/images/location/00322/00322a.jpg",
  "https://fpf.ccidahk.gov.hk/common/images/location/01067/01067a.jpg",
];

const getFallbackImage = (id) => fallbackImages[(Number(id) - 1) % fallbackImages.length] || fallbackImages[0];

const formatRating = (rating) =>
  Number.isFinite(Number(rating))
    ? Number(rating).toFixed(1).replace(".", ",")
    : "0,0";

export function mapPlaceSummary(place) {
  return {
    id: place.id,
    name: place.nome,
    address: place.endereco_resumido || place.endereco,
    image: place.imagem_url || getFallbackImage(place.id),
    fallbackImage: getFallbackImage(place.id),
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
