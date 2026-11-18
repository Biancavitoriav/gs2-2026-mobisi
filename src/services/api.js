const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/mobisi";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      body?.detail?.[0]?.msg ||
        body?.detail ||
        `A API respondeu com o status ${response.status}.`,
    );
    error.status = response.status;
    throw error;
  }

  return body;
}

export function listPlaces({
  search = "",
  category = "",
  page = 1,
  limit = 50,
} = {}) {
  const params = new URLSearchParams({ pagina: page, limite: limit });
  if (search.trim()) params.set("busca", search.trim());
  if (category.trim()) params.set("categoria", category.trim());
  return request(`/locais?${params}`);
}

export function getPlace(id) {
  return request(`/locais/${id}`);
}

export function getAccessibilityQuestions() {
  return request("/acessibilidade/perguntas");
}

function getReviewItems(data) {
  if (Array.isArray(data)) return data;
  return (
    data?.avaliacoes ||
    data?.itens ||
    data?.items ||
    data?.data?.avaliacoes ||
    data?.data?.itens ||
    data?.data?.items ||
    []
  );
}

function getReviewTotal(data) {
  return Number(
    data?.total ??
      data?.total_avaliacoes ??
      data?.pagination?.total ??
      data?.paginacao?.total ??
      data?.data?.total ??
      0,
  );
}

export async function listPlaceReviews(localId, { page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ pagina: page, limite: limit });
  const firstPage = await request(`/locais/${localId}/avaliacoes?${params}`);
  const firstItems = getReviewItems(firstPage);
  const total = getReviewTotal(firstPage);
  const pageCount = total > 0 ? Math.ceil(total / limit) : 1;

  if (pageCount <= page || firstItems.length >= total) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - page }, (_, index) => {
      const nextPage = page + index + 1;
      return request(
        `/locais/${localId}/avaliacoes?pagina=${nextPage}&limite=${limit}`,
      );
    }),
  );

  return {
    ...firstPage,
    avaliacoes: [
      ...firstItems,
      ...remainingPages.flatMap(getReviewItems),
    ],
  };
}

export function createReview(localId, respostas) {
  return request(`/locais/${localId}/avaliacoes`, {
    method: "POST",
    body: JSON.stringify({ respostas }),
  });
}
