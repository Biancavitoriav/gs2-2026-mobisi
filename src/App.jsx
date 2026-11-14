import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import { mapPlaceDetails } from "./data/places";
import { createReview, getPlace } from "./services/api";
import { MobisiProvider, useMobisi } from "./context/MobisiContext";
import HomePage from "./pages/HomePage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import EvaluationPage from "./pages/EvaluationPage";

function HomeRoute() {
  const navigate = useNavigate();
  const {
    favorites,
    toggleFavorite,
    places,
    placesLoading,
    placesError,
    loadPlaces,
  } = useMobisi();
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return places.filter((place) => {
      const matchesQuery =
        !normalizedQuery ||
        `${place.name} ${place.address} ${place.tag}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesQuery && (!onlyFavorites || favorites.has(place.id));
    });
  }, [favorites, onlyFavorites, places, query]);

  return (
    <HomePage
      query={query}
      setQuery={setQuery}
      onlyFavorites={onlyFavorites}
      setOnlyFavorites={setOnlyFavorites}
      places={filteredPlaces}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      onOpen={(place) => navigate(`/places/${place.id}`)}
      loading={placesLoading}
      error={placesError}
      onRetry={() => loadPlaces()}
    />
  );
}

function PlaceRoute() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, places } = useMobisi();
  const [place, setPlace] = useState(
    () => places.find((item) => item.id === Number(placeId)) || null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getPlace(placeId)
      .then((data) => {
        if (active) setPlace(mapPlaceDetails(data));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [placeId]);

  if (loading && !place)
    return (
      <main className="page-state">
        <p>Carregando detalhes do local…</p>
      </main>
    );
  if (error && !place)
    return (
      <main className="page-state error-state">
        <h1>Não foi possível carregar este local</h1>
        <p>{error}</p>
        <button type="button" onClick={() => navigate("/")}>
          Voltar para lugares
        </button>
      </main>
    );
  if (!place) return <Navigate to="/" replace />;
  return (
    <PlaceDetailsPage
      place={place}
      favorite={favorites.has(place.id)}
      onToggleFavorite={toggleFavorite}
      onBack={() => navigate("/")}
      onEvaluate={() => navigate(`/places/${place.id}/avaliar`)}
      loading={loading}
    />
  );
}

function EvaluationRoute() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { places, questions, questionsLoading, questionsError, loadQuestions } =
    useMobisi();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const place = places.find((item) => item.id === Number(placeId));

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (!place) return <Navigate to="/" replace />;

  const handleSubmit = async (answers) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const answerMap = { Sim: "SIM", Não: "NAO", "Não sei": "NAO_SEI" };
      const respostas = questions
        .flatMap((group) => group.questions)
        .map((question) => ({
          pergunta_id: question.id,
          resposta: answerMap[answers[question.id]],
        }));
      await createReview(place.id, respostas);
      navigate(`/places/${place.id}`);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (questionsLoading || !questions.length)
    return (
      <main className="page-state">
        <p>{questionsError || "Carregando perguntas…"}</p>
        {questionsError && (
          <button type="button" onClick={loadQuestions}>
            Tentar novamente
          </button>
        )}
      </main>
    );
  return (
    <EvaluationPage
      place={place}
      questionGroups={questions}
      onBack={() => navigate(`/places/${place.id}`)}
      onSubmit={handleSubmit}
      submitting={submitting}
      error={submitError}
    />
  );
}

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <MobisiProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/places/:placeId" element={<PlaceRoute />} />
            <Route
              path="/places/:placeId/avaliar"
              element={<EvaluationRoute />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MobisiProvider>
  );
}
