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

export function createReview(localId, respostas) {
  return request(`/locais/${localId}/avaliacoes`, {
    method: "POST",
    body: JSON.stringify({ respostas }),
  });
}
