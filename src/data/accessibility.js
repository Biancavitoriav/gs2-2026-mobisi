export const accessibilityGroupMeta = {
  FISICA: { title: "Física", icon: "bx bx-accessibility", color: "#075b91" },
  VISUAL: { title: "Visual", icon: "bx bx-eye", color: "#075b91" },
  AUDITIVA: { title: "Auditiva", icon: "bx bx-volume-full", color: "#075b91" },
  COGNITIVA: { title: "Cognitiva", icon: "bx bx-brain", color: "#075b91" },
};

export function mapQuestionGroups(data) {
  return (data?.dimensoes || []).map((dimension) => ({
    code: dimension.codigo,
    title: dimension.nome,
    icon:
      accessibilityGroupMeta[dimension.codigo]?.icon || "bx bx-check-circle",
    questions: (dimension.perguntas || []).map((question) => ({
      id: question.id,
      text: question.texto,
    })),
  }));
}

const statusLabels = {
  ACESSIVEL: "Acessível",
  PARCIAL: "Parcial",
  PRECISA_MELHORAR: "Precisa melhorar",
  NAO_AVALIADA: "Não avaliada",
};

const responseAliases = {
  sim: ["sim", "SIM", "sim_count", "quantidade_sim", "total_sim"],
  nao: ["nao", "não", "NAO", "NÃO", "nao_count", "quantidade_nao", "total_nao"],
  naoSei: [
    "nao_sei",
    "não_sei",
    "NAO_SEI",
    "NÃO_SEI",
    "naoSei",
    "nao_sei_count",
    "quantidade_nao_sei",
    "total_nao_sei",
  ],
};

const responseContainers = [
  "respostas",
  "resumo",
  "contagem",
  "contagens",
  "respostas_por_opcao",
];

function asNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getResponseSources(item) {
  return [item, ...responseContainers.map((key) => item?.[key])].filter(
    (source) => source && typeof source === "object",
  );
}

function getResponseValue(item, aliases) {
  for (const source of getResponseSources(item)) {
    for (const alias of aliases) {
      const value = asNumber(source[alias]);
      if (value !== null) return value;
    }
  }

  return 0;
}

function getResponseCount(item, sim, nao, naoSei, fallbackCount) {
  const totalAliases = [
    "total_respostas",
    "total_respostas_registradas",
    "total",
    "quantidade_respostas",
    "respostas_count",
  ];

  for (const source of getResponseSources(item)) {
    for (const alias of totalAliases) {
      const value = asNumber(source[alias]);
      if (value !== null) return value;
    }
  }

  const responseSum = sim + nao + naoSei;
  return responseSum > 0 ? responseSum : fallbackCount;
}

function normalizeItems(items) {
  if (Array.isArray(items)) return items;
  if (!items || typeof items !== "object") return [];

  return Object.entries(items).map(([code, value]) => ({
    ...(value && typeof value === "object" ? value : {}),
    dimensao: value?.dimensao || code,
  }));
}

export function mapAccessibilityGroups(items = [], totalReviews = 0) {
  return normalizeItems(items).map((item) => {
    const sim = getResponseValue(item, responseAliases.sim);
    const nao = getResponseValue(item, responseAliases.nao);
    const naoSei = getResponseValue(item, responseAliases.naoSei);

    return {
      code: item.dimensao,
      title:
        item.nome ||
        accessibilityGroupMeta[item.dimensao]?.title ||
        item.dimensao,
      icon: accessibilityGroupMeta[item.dimensao]?.icon || "bx bx-check-circle",
      color: accessibilityGroupMeta[item.dimensao]?.color || "#075b91",
      status: item.status,
      statusLabel: statusLabels[item.status] || "Não avaliada",
      statusClass:
        item.status === "ACESSIVEL"
          ? "accessible"
          : item.status === "PARCIAL"
            ? "partial"
            : "needs-work",
      percentage: item.percentual,
      sim,
      nao,
      naoSei,
      responseCount: getResponseCount(item, sim, nao, naoSei, totalReviews),
    };
  });
}
