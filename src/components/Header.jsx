import { useState } from 'react'

const links = [
  ['solucao', 'Solução'],
  ['beneficios', 'Benefícios'],
  ['como-funciona', 'Como funciona'],
  ['contato', 'Contato'],
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <header className="cabecalho">
      <div className="container cabecalho-linha">
        <a href="#solucao" className="logo" aria-label="Mobisi - página inicial" onClick={fecharMenu}>
          mobi<strong>si</strong>
        </a>

        <button
          type="button"
          className="botao-menu"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`menu ${menuAberto ? 'menu-aberto' : ''}`} aria-label="Navegação principal">
          <ul className="lista-menu">
            {links.map(([id, nome], index) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`link-menu ${index === 0 ? 'ativo' : ''}`}
                  onClick={fecharMenu}
                >
                  {nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
