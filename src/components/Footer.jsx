const acessos = [
  ['solucao', 'Solução'],
  ['beneficios', 'Benefícios'],
  ['como-funciona', 'Como funciona'],
  ['contato', 'Contato'],
]

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="container grid-rodape grid">
        <div className="marca-rodape item">
          <p className="logo logo-clara">mobi<strong>si</strong></p>
          <p className="texto-feat">Mobilidade inteligente para todos.</p>
        </div>

        <nav className="menu-rodape item" aria-label="Acesso rápido no rodapé">
          <h3>Acesso rápido</h3>
          <ul>
            {acessos.map(([id, nome]) => <li key={id}><a href={`#${id}`}>{nome}</a></li>)}
          </ul>
        </nav>

        <div className="menu-rodape item">
          <h3>Projeto</h3>
          <p className="texto-feat">GS2 2026 · Mobisi</p>
        </div>
      </div>
    </footer>
  )
}
