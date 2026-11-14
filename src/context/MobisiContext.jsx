import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAccessibilityQuestions, listPlaces } from "../services/api";
import { mapQuestionGroups } from "../data/accessibility";
import { mapPlaceSummary } from "../data/places";

const MobisiContext = createContext(null);

export function MobisiProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set());
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState("");

  const loadPlaces = useCallback(async (options = {}) => {
    setPlacesLoading(true);
    setPlacesError("");
    try {
      const data = await listPlaces(options);
      setPlaces((data?.itens || []).map(mapPlaceSummary));
    } catch (error) {
      setPlacesError(error.message);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  const loadQuestions = useCallback(async () => {
    if (questionsLoading || questions.length) return;
    setQuestionsLoading(true);
    setQuestionsError("");
    try {
      setQuestions(mapQuestionGroups(await getAccessibilityQuestions()));
    } catch (error) {
      setQuestionsError(error.message);
    } finally {
      setQuestionsLoading(false);
    }
  }, [questions, questionsLoading]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const toggleFavorite = (id) =>
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <MobisiContext.Provider
      value={{
        favorites,
        toggleFavorite,
        places,
        placesLoading,
        placesError,
        loadPlaces,
        questions,
        questionsLoading,
        questionsError,
        loadQuestions,
      }}
    >
      {children}
    </MobisiContext.Provider>
  );
}

export function useMobisi() {
  const context = useContext(MobisiContext);
  if (!context)
    throw new Error("useMobisi deve ser usado dentro de MobisiProvider");
  return context;
}
