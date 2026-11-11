import { useState } from 'react'
import ilustracaoMobisi from '../assets/mobisi-ilustracao.png'
import logoSimbolo from '../assets/logo-simbolo.png'
import logoMobisi from '../assets/logo-mobisi.png'
import Input from '../components/Input'

const telas = {
  login: {
    titulo: 'Login',
    subtitulo: 'Entre com a sua conta já cadastrada',
    botaoPrincipal: 'Entrar',
    botaoAlternativo: 'Criar conta',
  },
  cadastro: {
    titulo: 'Cadastro',
    subtitulo: 'Crie uma nova conta na plataforma',
    botaoPrincipal: 'Criar conta',
    botaoAlternativo: 'Entrar',
  },
}

function Logo() {
  return (
    <div className="marca" aria-label="Mobisi">
      <img className="logo-simbolo" src={logoSimbolo} alt="" aria-hidden="true" />
      <img className="logo-nome" src={logoMobisi} alt="Mobisi" />
    </div>
  )
}

export default function Home() {
  const [tela, setTela] = useState('login')
  const [mensagem, setMensagem] = useState('')
  const configuracao = telas[tela]

  function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagem(tela === 'login' ? 'Login pronto para ser conectado.' : 'Cadastro pronto para ser conectado.')
  }

  return (
    <main className="auth-shell">
      <section className="painel-apresentacao" aria-label="Sobre o Mobisi">
        <Logo />
        <img className="ilustracao-mobisi" src={ilustracaoMobisi} alt="Pessoas aproveitando um momento ao ar livre com uma pessoa usando cadeira de rodas" />
        <div className="texto-apresentacao">
          <h1>Mais autonomia<br />para viver a cidade</h1>
          <p>Encontre lugares mais acessíveis,<br className="quebra-desktop" /> compartilhe experiências e<br className="quebra-desktop" /> descubra equipamentos para<br className="quebra-desktop" /> viver com mais liberdade.</p>
        </div>
      </section>

      <section className="painel-formulario" aria-labelledby="titulo-auth">
        <div className="conteudo-auth">
          <header className="cabecalho-auth">
            <h2 id="titulo-auth">{configuracao.titulo}</h2>
            <p>{configuracao.subtitulo}</p>
          </header>

          <form className="formulario-auth" onSubmit={enviarFormulario}>
            {tela === 'cadastro' && <Input id="nome" label="Nome" placeholder="Digite seu nome" icon="bx-user" />}
            <Input id="email" label="E-mail" placeholder="Digite seu e-mail" icon="bx-envelope" type="email" />
            <Input id="senha" label="Senha" placeholder="Digite sua senha" icon="bx-lock" type="password" />

            <div className="acoes-auth">
              <button type="button" className="botao-auth botao-secundario" onClick={() => { setTela(tela === 'login' ? 'cadastro' : 'login'); setMensagem('') }}>
                {configuracao.botaoAlternativo}
              </button>
              <button type="submit" className="botao-auth botao-principal">{configuracao.botaoPrincipal}</button>
            </div>
            {mensagem && <p className="mensagem-auth" role="status">{mensagem}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}
