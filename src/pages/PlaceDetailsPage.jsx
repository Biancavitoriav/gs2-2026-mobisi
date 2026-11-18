import { mapAccessibilityGroups } from "../data/accessibility";
import PlaceImage from "../components/PlaceImage";
import { Stars } from "../components/StarRating";

function LocalInfo({ place }) {
  return (
    <section className="local-info info-panel" aria-labelledby="local-info-title">
      <h2 id="local-info-title">Informações do local</h2>
      <div className="contact-row">
        <span className="info-icon">
          <i className="bx bx-phone" aria-hidden="true" />
        </span>
        <span>Telefone</span>
        <strong>{place.phone || "Não informado"}</strong>
      </div>
      <div className="contact-row">
        <span className="info-icon">
          <i className="bx bx-location-pin" aria-hidden="true" />
        </span>
        <span>Categoria</span>
        <strong>{place.tag || "Não informada"}</strong>
      </div>
      <div className="contact-row">
        <span className="info-icon">
          <i className="bx bx-globe" aria-hidden="true" />
        </span>
        <span>Website</span>
        {place.website ? (
          <a
            href={place.website}
            target="_blank"
            rel="noreferrer"
            aria-label={`Acessar o site de ${place.name} em uma nova aba`}
          >
            Acessar site
          </a>
        ) : (
          <strong>Não informado</strong>
        )}
      </div>
    </section>
  );
}

function AccessibilitySummary({ groups }) {
  return (
    <section
      className="accessibility-summary info-panel"
      aria-labelledby="accessibility-summary-title"
    >
      <h2 id="accessibility-summary-title">Acessibilidade</h2>
      <div className="summary-grid">
        {groups.map((group) => (
          <div key={group.code}>
            <span
              className="summary-dot"
              style={{
                backgroundColor:
                  group.statusClass === "accessible"
                    ? "#49b67a"
                    : group.statusClass === "partial"
                      ? "#f1bc39"
                      : group.status === "NAO_AVALIADA"
                        ? "#c9ccce"
                        : "#ec6d72",
              }}
            >
              <i className={group.icon} aria-hidden="true" />
            </span>
            <b>{group.title}</b>
            <small>{group.statusLabel}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResponseLines({ item, showTotal = false }) {
  const total = item.sim + item.nao + item.naoSei;
  const responseCount = Number(item.responseCount) || 0;
  const responseLabel = (count, answer) =>
    showTotal && responseCount > 0
      ? count + " de " + responseCount + " responderam que “" + answer + "”"
      : count + " responderam “" + answer + "”";

  if (total === 0 && responseCount === 0) {
    return (
      <p>
        <span className="bullet bullet-2" />
        Ainda não há respostas registradas
      </p>
    );
  }

  if (total === 0) {
    return (
      <p>
        <span className="bullet bullet-2" />
        {responseCount}{" "}
        {responseCount === 1
          ? "avaliação registrada"
          : "avaliações registradas"}
        , mas o resumo das respostas ainda não está disponível
      </p>
    );
  }

  return (
    <>
      <p>
        <span className="bullet" />
        {responseLabel(item.sim, "Sim")}
      </p>
      <p>
        <span className="bullet bullet-1" />
        {responseLabel(item.nao, "Não")}
      </p>
      <p>
        <span className="bullet bullet-2" />
        {showTotal && responseCount > 0
          ? item.naoSei +
            " de " +
            responseCount +
            " responderam que “Não sei”"
          : item.naoSei + " responderam “Não sei”"}
        {item.percentage != null
          ? " · " + Number(item.percentage).toFixed(0) + "%"
          : ""}
      </p>
    </>
  );
}

function CriterionCard({ item, showTotal }) {
  return (
    <div className="criterion-card">
      <div className="criterion-heading">
        <strong>{item.title || "Resumo das respostas"}</strong>
        <span className={"status-pill " + item.statusClass}>
          {item.statusLabel}
        </span>
      </div>
      <ResponseLines item={item} showTotal={showTotal} />
    </div>
  );
}

function DetailGroup({ group }) {
  const criteria = group.criteria.length
    ? group.criteria
    : group.hasHistoricalData
      ? []
      : [
        {
          title: "Resumo das respostas",
          statusClass: group.statusClass,
          statusLabel: group.statusLabel,
          percentage: group.percentage,
          sim: group.sim,
          nao: group.nao,
          naoSei: group.naoSei,
          responseCount: group.responseCount,
        },
      ];

  return (
    <section className="accessibility-group">
      <h3>
        <span style={{ backgroundColor: group.color }}>
          <i className={group.icon} aria-hidden="true" />
        </span>
        {group.title}
      </h3>
      {criteria.length > 0 ? (
        <div className="criteria-grid">
          {criteria.map((criterion, index) => (
            <CriterionCard
              key={group.code + "-" + index}
              item={criterion}
              showTotal={criteria.length > 1}
            />
          ))}
        </div>
      ) : (
        <p className="criteria-empty">
          Ainda não há histórico detalhado para esta categoria.
        </p>
      )}
    </section>
  );
}

export default function PlaceDetailsPage({
  place,
  questionGroups = [],
  reviewData,
  favorite,
  onToggleFavorite,
  onBack,
  onEvaluate,
}) {
  const accessibilityGroups = mapAccessibilityGroups(
    place.accessibility,
    place.reviews,
    place.historicalAccessibility,
    questionGroups,
    reviewData,
  );
  return (
    <main className="details-page">
      <button type="button" className="back-link" onClick={onBack}>
        <i className="bx bx-arrow-left" aria-hidden="true" />
        Voltar
      </button>
      <section className="detail-overview" aria-labelledby="detail-title">
        <PlaceImage place={place} className="detail-image" />
        <div className="detail-side">
          <div className="detail-heading">
            <div>
              <h1 id="detail-title">{place.name}</h1>
              <p>{place.address}</p>
            </div>
            <button
              type="button"
              className={`detail-favorite ${favorite ? "active" : ""}`}
              aria-label={
                favorite
                  ? `Remover ${place.name} dos favoritos`
                  : `Adicionar ${place.name} aos favoritos`
              }
              aria-pressed={favorite}
              onClick={() => onToggleFavorite(place.id)}
            >
              <i
                className={`${favorite ? "bxf" : "bx"} bx-heart`}
                aria-hidden="true"
              />
              {favorite ? "Favoritado" : "Favoritar"}
            </button>
          </div>
          <div className="detail-panels">
            <LocalInfo place={place} />
            <AccessibilitySummary groups={accessibilityGroups} />
          </div>
          <div className="detail-rating info-panel">
            <div>
              <h2>Avaliação</h2>
              <div className="detail-rating-line">
                <strong>{place.rating}</strong>
                <Stars rating={place.rating} />
                <small>({place.reviews} avaliações)</small>
              </div>
            </div>
            <button type="button" className="rate-button" onClick={onEvaluate}>
              <i className="bx bx-star" aria-hidden="true" /> Avaliar
            </button>
          </div>
        </div>
      </section>
      <h2 className="details-title" id="details-title">
        Detalhes das avaliações
      </h2>
      <section
        className="accessibility-groups"
        aria-labelledby="details-title"
      >
        {accessibilityGroups.map((group) => (
          <DetailGroup key={group.code} group={group} />
        ))}
      </section>
    </main>
  );
}
