import { mapAccessibilityGroups } from "../data/accessibility";
import {
  ArrowLeftIcon,
  GlobeIcon,
  HeartIcon,
  PhoneIcon,
  PinIcon,
} from "../components/Icons";
import { Stars } from "../components/StarRating";

function LocalInfo({ place }) {
  return (
    <div className="local-info info-panel">
      <h3>Informações do local</h3>
      <div className="contact-row">
        <PhoneIcon />
        <span>Telefone</span>
        <strong>{place.phone || "Não informado"}</strong>
      </div>
      <div className="contact-row">
        <PinIcon />
        <span>Categoria</span>
        <strong>{place.tag || "Não informada"}</strong>
      </div>
      <div className="contact-row">
        <GlobeIcon />
        <span>Website</span>
        {place.website ? (
          <a href={place.website} target="_blank" rel="noreferrer">
            Acessar site
          </a>
        ) : (
          <strong>Não informado</strong>
        )}
      </div>
    </div>
  );
}

function AccessibilitySummary({ groups }) {
  return (
    <div className="accessibility-summary info-panel">
      <h3>Acessibilidade</h3>
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
    </div>
  );
}

function DetailGroup({ group }) {
  const total = group.sim + group.nao + group.naoSei;
  const percentage =
    group.percentage == null ? null : `${Number(group.percentage).toFixed(0)}%`;
  return (
    <section className="accessibility-group">
      <h3>
        <span style={{ backgroundColor: group.color }}>
          <i className={group.icon} aria-hidden="true" />
        </span>
        {group.title}
      </h3>
      <div className="criteria-grid">
        <div className="criterion-card">
          <div className="criterion-heading">
            <strong>Resumo das respostas</strong>
            <span className={`status-pill ${group.statusClass}`}>
              {group.statusLabel}
            </span>
          </div>
          {total === 0 ? (
            <p>
              <span className="bullet bullet-2" />
              Ainda não há respostas registradas
            </p>
          ) : (
            <>
              <p>
                <span className="bullet" />
                {group.sim} responderam “Sim”
              </p>
              <p>
                <span className="bullet bullet-1" />
                {group.nao} responderam “Não”
              </p>
              <p>
                <span className="bullet bullet-2" />
                {group.naoSei} responderam “Não sei”
                {percentage ? ` · ${percentage}` : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PlaceDetailsPage({
  place,
  favorite,
  onToggleFavorite,
  onBack,
  onEvaluate,
}) {
  const accessibilityGroups = mapAccessibilityGroups(place.accessibility);
  return (
    <main className="details-page">
      <button type="button" className="back-link" onClick={onBack}>
        <ArrowLeftIcon />
        Voltar
      </button>
      <section className="detail-overview" aria-labelledby="detail-title">
        <img
          src={place.image}
          alt={`Imagem de ${place.name}`}
          className="detail-image"
        />
        <div className="detail-side">
          <div className="detail-heading">
            <div>
              <h1 id="detail-title">{place.name}</h1>
              <p>{place.address}</p>
            </div>
            <button
              type="button"
              className={`detail-favorite ${favorite ? "active" : ""}`}
              onClick={() => onToggleFavorite(place.id)}
            >
              <HeartIcon filled={favorite} />
              {favorite ? "Favoritado" : "Favoritar"}
            </button>
          </div>
          <div className="detail-panels">
            <LocalInfo place={place} />
            <AccessibilitySummary groups={accessibilityGroups} />
          </div>
          <div className="detail-rating info-panel">
            <div>
              <h3>Avaliação</h3>
              <div className="detail-rating-line">
                <strong>{place.rating}</strong>
                <Stars />
                <small>({place.reviews} avaliações)</small>
              </div>
            </div>
            <button type="button" className="rate-button" onClick={onEvaluate}>
              <i className="bx bx-star" aria-hidden="true" /> Avaliar
            </button>
          </div>
        </div>
      </section>
      <div className="details-title">Detalhes das avaliações</div>
      <div className="accessibility-groups">
        {accessibilityGroups.map((group) => (
          <DetailGroup key={group.code} group={group} />
        ))}
      </div>
    </main>
  );
}
