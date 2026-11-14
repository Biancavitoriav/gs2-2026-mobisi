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

export function mapAccessibilityGroups(items = []) {
  return items.map((item) => ({
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
    sim: item.sim || 0,
    nao: item.nao || 0,
    naoSei: item.nao_sei || 0,
  }));
}
