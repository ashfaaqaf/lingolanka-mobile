import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

type Direction = "english-to-sinhala" | "sinhala-to-english";
type LearningState = { completed: string[]; xp: number; direction: Direction };
type LearningContextValue = LearningState & {
  ready: boolean;
  completeLesson: (id: string) => Promise<void>;
  setDirection: (direction: Direction) => Promise<void>;
  reset: () => Promise<void>;
};

const STORAGE_KEY = "lingolanka-native-progress-v1";
const initialState: LearningState = { completed: [], xp: 0, direction: "english-to-sinhala" };
const learningStateSchema = z.object({
  completed: z.array(z.string()),
  xp: z.number().int().nonnegative(),
  direction: z.enum(["english-to-sinhala", "sinhala-to-english"])
});
const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed = learningStateSchema.safeParse(JSON.parse(stored));
        if (parsed.success) setState(parsed.data);
      })
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback(async (next: LearningState) => {
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const completeLesson = useCallback(
    async (id: string) => {
      if (state.completed.includes(id)) return;
      await persist({ ...state, completed: [...state.completed, id], xp: state.xp + 20 });
    },
    [persist, state]
  );

  const setDirection = useCallback(
    async (direction: Direction) => {
      await persist({ ...state, direction });
    },
    [persist, state]
  );

  const reset = useCallback(async () => {
    setState(initialState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ ...state, ready, completeLesson, setDirection, reset }),
    [state, ready, completeLesson, setDirection, reset]
  );
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

// The provider and its hook intentionally share this tiny module.
// eslint-disable-next-line react-refresh/only-export-components
export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error("useLearning must be used inside LearningProvider");
  return value;
}
