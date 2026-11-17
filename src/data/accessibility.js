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
      shortTitle: questionShortTitles[question.id] || question.texto,
    })),
  }));
}

const questionShortTitles = {
  1: "Rampas/elevadores",
  2: "Vagas PCD",
  3: "Fácil locomoção",
  4: "Piso tátil",
  5: "Obstáculos e sinalização",
  6: "Placas em Braille",
  7: "Atendimento por texto",
  8: "Atendimento em Libras",
  9: "Conteúdos com legendas",
  10: "Espaço silencioso",
  11: "Estímulos do ambiente",
  12: "Comunicação respeitosa",
};

const statusLabels = {
  ACESSIVEL: "Acessível",
  PARCIAL: "Parcial",
  PRECISA_MELHORAR: "Precisa melhorar",
  NAO_AVALIADA: "Não avaliada",
};

const responseAliases = {
  sim: ["sim", "Sim", "SIM", "sim_count", "quantidade_sim", "total_sim"],
  nao: [
    "nao",
    "não",
    "Nao",
    "Não",
    "NAO",
    "NÃO",
    "nao_count",
    "quantidade_nao",
    "total_nao",
  ],
  naoSei: [
    "nao_sei",
    "não_sei",
    "Nao_sei",
    "Não_sei",
    "Não sei",
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

const criteriaContainers = [
  "perguntas",
  "criterios",
  "itens",
  "avaliacoes",
  "detalhes",
  "questions",
  "respostas_por_pergunta",
];

const criterionTitleAliases = [
  "texto",
  "pergunta",
  "nome",
  "titulo",
  "label",
  "criterio",
  "descricao",
  "description",
];

const historicalCriterionMeta = {
  rampa: { code: "FISICA", title: "Rampa" },
  banheiro_acessivel: {
    code: "FISICA",
    title: "Banheiro acessível",
  },
  elevador: { code: "FISICA", title: "Elevador" },
  piso_tatil: { code: "VISUAL", title: "Piso tátil" },
  libras: { code: "AUDITIVA", title: "Libras" },
};

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

function hasResponseData(item) {
  return getResponseSources(item).some((source) =>
    responseAliases.sim
      .concat(responseAliases.nao, responseAliases.naoSei)
      .some((alias) => asNumber(source[alias]) !== null),
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

function normalizeCriteria(items) {
  if (Array.isArray(items)) return items;
  if (!items || typeof items !== "object") return [];

  return Object.entries(items).map(([key, value]) => {
    const title = value?.nome || value?.titulo || value?.texto;
    return {
      ...(value && typeof value === "object" ? value : { valor: value }),
      ...(title ? { nome: title } : {}),
      criterionKey: key,
    };
  });
}

function getCriteriaContainer(item) {
  if (Array.isArray(item)) return item;

  for (const key of criteriaContainers) {
    const value = item?.[key];
    if (Array.isArray(value) || (value && typeof value === "object")) {
      return value;
    }
  }

  return null;
}

function findHistoricalGroup(historicalItems, code) {
  if (Array.isArray(historicalItems)) {
    return historicalItems.filter(
      (item) => item?.dimensao === code || item?.codigo === code,
    );
  }

  if (!historicalItems || typeof historicalItems !== "object") return null;

  return (
    historicalItems[code] ||
    historicalItems[code?.toLowerCase()] ||
    historicalItems[code?.toUpperCase()] ||
    null
  );
}

function getCriterionTitle(item, fallback) {
  for (const alias of criterionTitleAliases) {
    if (typeof item?.[alias] === "string" && item[alias].trim()) {
      return item[alias].trim();
    }
  }

  return fallback;
}

function getQuestionTitle(item, code, questionGroups) {
  const questionId =
    item?.pergunta_id ??
    item?.question_id ??
    item?.id_pergunta ??
    (String(item?.criterionKey || "").match(/^\d+$/)
      ? item.criterionKey
      : null);
  if (questionId == null) return null;

  const group = questionGroups.find((questionGroup) => questionGroup.code === code);
  const question = group?.questions.find(
    (candidate) => String(candidate.id) === String(questionId),
  );
  return question?.text || null;
}

function inferStatus(item, sim, nao, naoSei) {
  if (item.status) return item.status;

  const total = sim + nao + naoSei;
  if (total === 0) return "NAO_AVALIADA";
  if (nao > sim) return "PRECISA_MELHORAR";
  if (nao > 0 || naoSei > 0) return "PARCIAL";
  return "ACESSIVEL";
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function findHistoricalCriterion(question, historicalItems) {
  const questionText = normalizeText(question.text);
  const historyEntries = normalizeCriteria(historicalItems);
  let bestMatch = null;
  let bestScore = 0;

  historyEntries.forEach((entry) => {
    const key = normalizeText(entry.criterionKey || entry.nome);
    const words = key.split(/[^a-z0-9]+/).filter((word) => word.length > 2);
    const matchedWords = words.filter((word) => questionText.includes(word));
    const score =
      words.length > 1
        ? matchedWords.length === words.length
          ? matchedWords.length * 2
          : 0
        : matchedWords.length * 2;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  return bestMatch;
}

function getHistoricalCriterionMeta(key) {
  return historicalCriterionMeta[normalizeText(key).replace(/[^a-z0-9]+/g, "_")];
}

function mapHistoricalCriteria(historicalItems, code, totalReviews) {
  return normalizeCriteria(historicalItems)
    .map((criterion) => ({
      criterion,
      meta: getHistoricalCriterionMeta(criterion.criterionKey),
    }))
    .filter(({ meta }) => meta?.code === code)
    .map(({ criterion, meta }) =>
      mapCriterion(
        {
          ...criterion,
          nome: meta.title,
        },
        meta.title,
        totalReviews,
        code,
        [],
      ),
    );
}

function mapQuestionCriteria(questionGroup, historicalItems, totalReviews) {
  return questionGroup.questions.map((question) => {
    const historicalCriterion = findHistoricalCriterion(
      question,
      historicalItems,
    );
    const criterion = historicalCriterion
      ? {
          ...historicalCriterion,
          nome: question.shortTitle || question.text,
          pergunta_id: question.id,
        }
      : {
          nome: question.shortTitle || question.text,
          pergunta_id: question.id,
          status: "NAO_AVALIADA",
        };

    return mapCriterion(
      criterion,
      question.shortTitle || question.text,
      totalReviews,
      questionGroup.code,
      [questionGroup],
    );
  });
}

function mapCriterion(item, fallbackTitle, totalReviews, code, questionGroups) {
  const sim = getResponseValue(item, responseAliases.sim);
  const nao = getResponseValue(item, responseAliases.nao);
  const naoSei = getResponseValue(item, responseAliases.naoSei);
  const status = inferStatus(item, sim, nao, naoSei);

  return {
    title: getCriterionTitle(item, null) ||
      getQuestionTitle(item, code, questionGroups) ||
      fallbackTitle,
    status,
    statusLabel: statusLabels[status] || "Não avaliada",
    statusClass:
      status === "ACESSIVEL"
        ? "accessible"
        : status === "PARCIAL"
          ? "partial"
          : status === "PRECISA_MELHORAR"
            ? "needs-work"
            : "not-rated",
    percentage: item.percentual,
    sim,
    nao,
    naoSei,
    responseCount: getResponseCount(item, sim, nao, naoSei, totalReviews),
    hasResponseData: hasResponseData(item),
  };
}

function mapGroupCriteria(
  item,
  historicalItems,
  code,
  totalReviews,
  questionGroups,
) {
  const historicalGroup = findHistoricalGroup(historicalItems, code);
  const source =
    getCriteriaContainer(item) ||
    getCriteriaContainer(historicalGroup) ||
    (Array.isArray(historicalGroup)
      ? historicalGroup
      : historicalGroup &&
          typeof historicalGroup === "object" &&
          !hasResponseData(historicalGroup)
        ? historicalGroup
        : null);
  const criteria = normalizeCriteria(source);

  if (!criteria.length && historicalItems && typeof historicalItems === "object") {
    const historicalCriteria = mapHistoricalCriteria(
      historicalItems,
      code,
      totalReviews,
    );
    if (historicalCriteria.length) return historicalCriteria;
    return [];
  }

  if (!criteria.length) {
    const questionGroup = questionGroups.find(
      (group) => group.code === code,
    );
    if (questionGroup) {
      return mapQuestionCriteria(questionGroup, historicalItems, totalReviews);
    }
  }

  return criteria.map((criterion, index) =>
    mapCriterion(
      criterion,
      `Critério ${index + 1}`,
      totalReviews,
      code,
      questionGroups,
    ),
  );
}

export function mapAccessibilityGroups(
  items = [],
  totalReviews = 0,
  historicalItems = {},
  questionGroups = [],
) {
  return normalizeItems(items).map((item) => {
    const code = item.dimensao;
    const sim = getResponseValue(item, responseAliases.sim);
    const nao = getResponseValue(item, responseAliases.nao);
    const naoSei = getResponseValue(item, responseAliases.naoSei);

    return {
      code,
      title:
        item.nome ||
        accessibilityGroupMeta[code]?.title ||
        code,
      icon: accessibilityGroupMeta[code]?.icon || "bx bx-check-circle",
      color: accessibilityGroupMeta[code]?.color || "#075b91",
      hasHistoricalData:
        historicalItems && typeof historicalItems === "object"
          ? Object.keys(historicalItems).length > 0
          : false,
      criteria: mapGroupCriteria(
        item,
        historicalItems,
        code,
        totalReviews,
        questionGroups,
      ),
      status: item.status,
      statusLabel: statusLabels[item.status] || "Não avaliada",
      statusClass:
        item.status === "ACESSIVEL"
          ? "accessible"
          : item.status === "PARCIAL"
            ? "partial"
            : item.status === "PRECISA_MELHORAR"
              ? "needs-work"
              : "not-rated",
      percentage: item.percentual,
      sim,
      nao,
      naoSei,
      responseCount: getResponseCount(item, sim, nao, naoSei, totalReviews),
    };
  });
}
