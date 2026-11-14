import { useState } from "react";
import { ArrowLeftIcon } from "../components/Icons";

export default function EvaluationPage({
  place,
  questionGroups,
  onBack,
  onSubmit,
  submitting,
  error,
}) {
  const [answers, setAnswers] = useState({});
  const updateAnswer = (key, answer) =>
    setAnswers((current) => ({ ...current, [key]: answer }));

  return (
    <main className="evaluation-page">
      <button type="button" className="evaluation-back" onClick={onBack}>
        <ArrowLeftIcon />
        Voltar e descartar avaliação
      </button>
      <header className="evaluation-heading">
        <h1>Avaliar {place.name}</h1>
        <p>
          Sua experiência pode ajudar outras pessoas com deficiência a
          escolherem lugares mais seguros, confortáveis e acessíveis.
        </p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(answers);
        }}
      >
        <div className="evaluation-sections">
          {questionGroups.map((group) => (
            <section className="evaluation-section" key={group.code}>
              <h2>
                <span>
                  <i className={group.icon} aria-hidden="true" />
                </span>
                {group.title}
              </h2>
              <ol>
                {group.questions.map((question) => {
                  const key = question.id;
                  return (
                    <li key={question.id}>
                      <p>{question.text}</p>
                      <div className="answer-options">
                        {["Sim", "Não", "Não sei"].map((answer) => (
                          <label key={answer} className="answer-option">
                            <input
                              type="radio"
                              name={key}
                              value={answer}
                              required
                              checked={answers[key] === answer}
                              onChange={() => updateAnswer(key, answer)}
                            />
                            <span className="radio-control" />
                            {answer}
                          </label>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="evaluation-actions">
          <button type="button" className="discard-button" onClick={onBack}>
            Descartar
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            <i className="bx bx-send" aria-hidden="true" />{" "}
            {submitting ? "Enviando…" : "Submeter avaliação"}
          </button>
        </div>
      </form>
    </main>
  );
}
