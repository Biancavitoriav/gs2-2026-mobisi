export default function SectionTitle({ label, title, description, className = '' }) {
  return (
    <header className={`titulo-secao ${className}`}>
      {label && <span className="etiqueta etiqueta-contorno">{label}</span>}
      <h2>{title}</h2>
      {description && <p className="subtitulo">{description}</p>}
    </header>
  )
}
