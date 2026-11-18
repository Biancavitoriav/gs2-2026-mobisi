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

const statusClasses = {
  ACESSIVEL: "accessible",
  PARCIAL: "partial",
  PRECISA_MELHORAR: "needs-work",
  NAO_AVALIADA: "not-rated",
};

const responseAliases = {
  sim: ["sim", "sim_count", "quantidade_sim", "total_sim"],
  nao: ["nao", "nao_count", "quantidade_nao", "total_nao"],
  naoSei: [
    "nao_sei",
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

const responseTotalAliases = [
  "total_respostas",
  "total_respostas_registradas",
  "total",
  "quantidade_respostas",
  "respostas_count",
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
  for (const source of getResponseSources(item)) {
    for (const alias of responseTotalAliases) {
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
      (item) =>
        item?.dimensao === code || item?.codigo === code,
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

function getReviewItems(data) {
  if (Array.isArray(data)) return data;

  const items =
    data?.avaliacoes ||
    data?.itens ||
    data?.items ||
    data?.data?.avaliacoes ||
    data?.data?.itens ||
    data?.data?.items;

  return Array.isArray(items) ? items : [];
}

function getReviewTotal(data, reviews) {
  const aliases = [
    "total",
    "total_avaliacoes",
    "quantidade",
    "total_itens",
    "totalItems",
  ];

  const sources = [data, data?.pagination, data?.paginacao, data?.data];

  for (const source of sources) {
    for (const alias of aliases) {
      const value = asNumber(source?.[alias]);
      if (value !== null) return value;
    }
  }

  return reviews.length;
}

function getReviewAnswers(review) {
  const answers = review?.respostas || review?.responses || review?.answers;
  return Array.isArray(answers) ? answers : [];
}

function getAnswerQuestionKey(answer) {
  const questionId =
    answer?.pergunta_id ??
    answer?.question_id ??
    answer?.id_pergunta ??
    answer?.pergunta?.id ??
    answer?.question?.id;
  if (questionId !== null && questionId !== undefined) {
    return `id:${questionId}`;
  }

  const questionText =
    typeof answer?.pergunta === "string"
      ? answer.pergunta
      : answer?.pergunta?.texto ||
        answer?.pergunta?.pergunta ||
        answer?.question?.texto ||
        answer?.question?.text;

  return questionText ? `text:${String(questionText).toLowerCase()}` : null;
}

function normalizeAnswer(value) {
  const answer = String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();
  if (answer === "sim") return "sim";
  if (answer === "nao" || answer === "não") return "nao";
  if (answer === "nao sei" || answer === "não sei") return "naoSei";
  return null;
}

function getStatusForCounts(sim, nao, naoSei, responseCount) {
  if (!responseCount) return "NAO_AVALIADA";

  const positiveRate = sim / responseCount;
  if (positiveRate >= 0.8) return "ACESSIVEL";
  if (positiveRate >= 0.5) return "PARCIAL";
  return nao > 0 || naoSei > 0 ? "PRECISA_MELHORAR" : "NAO_AVALIADA";
}

function getStatusClass(status) {
  return statusClasses[status] || statusClasses.NAO_AVALIADA;
}

function getStatusInfo(status) {
  return {
    status,
    statusLabel: statusLabels[status] || "Não avaliada",
    statusClass: getStatusClass(status),
  };
}

function mapReviewGroups(reviewData, questionGroups) {
  const reviews = getReviewItems(reviewData);
  const totalReviews = getReviewTotal(reviewData, reviews);
  const countsByQuestion = new Map();

  questionGroups.forEach((group) => {
    group.questions.forEach((question) => {
      const counts = {
        sim: 0,
        nao: 0,
        naoSei: 0,
      };
      countsByQuestion.set(`id:${question.id}`, counts);
      countsByQuestion.set(
        `text:${String(question.text || "").toLowerCase()}`,
        counts,
      );
    });
  });

  reviews.flatMap(getReviewAnswers).forEach((answer) => {
    const key = getAnswerQuestionKey(answer);
    const response = normalizeAnswer(
      answer?.resposta ?? answer?.response ?? answer?.answer,
    );
    const counts = key ? countsByQuestion.get(key) : null;
    if (counts && response) counts[response] += 1;
  });

  return questionGroups.map((group) => {
    const criteria = group.questions.map((question) => {
      const counts = countsByQuestion.get(`id:${question.id}`) || {
        sim: 0,
        nao: 0,
        naoSei: 0,
      };
      const status = getStatusForCounts(
        counts.sim,
        counts.nao,
        counts.naoSei,
        totalReviews,
      );

      return {
        title: question.shortTitle || question.text,
        ...getStatusInfo(status),
        sim: counts.sim,
        nao: counts.nao,
        naoSei: counts.naoSei,
        responseCount: totalReviews,
        hasResponseData: counts.sim + counts.nao + counts.naoSei > 0,
      };
    });
    const totals = criteria.reduce(
      (summary, criterion) => ({
        sim: summary.sim + criterion.sim,
        nao: summary.nao + criterion.nao,
        naoSei: summary.naoSei + criterion.naoSei,
      }),
      { sim: 0, nao: 0, naoSei: 0 },
    );
    const status = getStatusForCounts(
      totals.sim,
      totals.nao,
      totals.naoSei,
      totalReviews * Math.max(criteria.length, 1),
    );

    return {
      code: group.code,
      title: group.title || accessibilityGroupMeta[group.code]?.title,
      icon: group.icon || accessibilityGroupMeta[group.code]?.icon,
      color: accessibilityGroupMeta[group.code]?.color || "#075b91",
      criteria,
      ...getStatusInfo(status),
      sim: totals.sim,
      nao: totals.nao,
      naoSei: totals.naoSei,
      responseCount: totalReviews,
      hasHistoricalData: totalReviews > 0,
    };
  });
}

function findHistoricalCriterion(question, historicalItems) {
  const questionText = String(question.text || "").toLowerCase();
  const historyEntries = normalizeCriteria(historicalItems);
  let bestMatch = null;
  let bestScore = 0;

  historyEntries.forEach((entry) => {
    const key = String(entry.criterionKey || entry.nome || "").toLowerCase();
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
  const normalizedKey = String(key || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  return historicalCriterionMeta[normalizedKey];
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
    title:
      getCriterionTitle(item, null) ||
      getQuestionTitle(item, code, questionGroups) ||
      fallbackTitle,
    ...getStatusInfo(status),
    percentage: item.percentual,
    sim,
    nao,
    naoSei,
    responseCount: getResponseCount(item, sim, nao, naoSei, totalReviews),
    hasResponseData: hasResponseData(item),
  };
}

function getCriteriaSource(item, historicalGroup) {
  const itemCriteria = getCriteriaContainer(item);
  if (itemCriteria) return itemCriteria;

  const historicalCriteria = getCriteriaContainer(historicalGroup);
  if (historicalCriteria) return historicalCriteria;

  if (Array.isArray(historicalGroup)) return historicalGroup;

  if (
    historicalGroup &&
    typeof historicalGroup === "object" &&
    !hasResponseData(historicalGroup)
  ) {
    return historicalGroup;
  }

  return null;
}

function mapGroupCriteria(
  item,
  historicalItems,
  code,
  totalReviews,
  questionGroups,
) {
  const historicalGroup = findHistoricalGroup(historicalItems, code);
  const criteria = normalizeCriteria(
    getCriteriaSource(item, historicalGroup),
  );

  if (criteria.length) {
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

  if (historicalItems && typeof historicalItems === "object") {
    const historicalCriteria = mapHistoricalCriteria(
      historicalItems,
      code,
      totalReviews,
    );
    return historicalCriteria;
  }

  const questionGroup = questionGroups.find((group) => group.code === code);
  return questionGroup
    ? mapQuestionCriteria(questionGroup, historicalItems, totalReviews)
    : [];
}

export function mapAccessibilityGroups(
  items = [],
  totalReviews = 0,
  historicalItems = {},
  questionGroups = [],
  reviewData = null,
) {
  if (reviewData && questionGroups.length) {
    return mapReviewGroups(reviewData, questionGroups);
  }

  return normalizeItems(items).map((item) => {
    const code = item.dimensao || item.codigo;
    const sim = getResponseValue(item, responseAliases.sim);
    const nao = getResponseValue(item, responseAliases.nao);
    const naoSei = getResponseValue(item, responseAliases.naoSei);
    const status = item.status || inferStatus(item, sim, nao, naoSei);

    return {
      code,
      title:
        item.nome || accessibilityGroupMeta[code]?.title || code,
      icon: accessibilityGroupMeta[code]?.icon || "bx bx-check-circle",
      color: accessibilityGroupMeta[code]?.color || "#075b91",
      hasHistoricalData:
        Array.isArray(historicalItems)
          ? historicalItems.length > 0
          : Boolean(
              historicalItems &&
                typeof historicalItems === "object" &&
                Object.keys(historicalItems).length > 0,
            ),
      criteria: mapGroupCriteria(
        item,
        historicalItems,
        code,
        totalReviews,
        questionGroups,
      ),
      ...getStatusInfo(status),
      percentage: item.percentual,
      sim,
      nao,
      naoSei,
      responseCount: getResponseCount(item, sim, nao, naoSei, totalReviews),
    };
  });
}
