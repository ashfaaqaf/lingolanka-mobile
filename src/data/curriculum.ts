import { z } from "zod";

const nativeLessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleSi: z.string().min(1),
  description: z.string().min(1),
  minutes: z.number().int().positive(),
  word: z.object({
    english: z.string().min(1),
    sinhala: z.string().regex(/[\u0D80-\u0DFF]/u),
    transliteration: z.string().min(1)
  })
});
export type NativeLesson = z.infer<typeof nativeLessonSchema>;

const nativeLessonSource = [
  {
    id: "greetings",
    title: "Greetings & courtesy",
    titleSi: "ආචාර සහ ආචාරශීලී බව",
    description: "Say hello, thank you and goodbye.",
    minutes: 6,
    word: { english: "hello", sinhala: "ආයුබෝවන්", transliteration: "āyubōvan" }
  },
  {
    id: "people",
    title: "People & family",
    titleSi: "මිනිසුන් සහ පවුල",
    description: "Talk about the people close to you.",
    minutes: 7,
    word: { english: "mother", sinhala: "අම්මා", transliteration: "ammā" }
  },
  {
    id: "questions",
    title: "Useful questions",
    titleSi: "ප්‍රයෝජනවත් ප්‍රශ්න",
    description: "Ask for help and check understanding.",
    minutes: 7,
    word: { english: "how are you?", sinhala: "ඔබට කොහොමද?", transliteration: "obaṭa kohomada?" }
  },
  {
    id: "places",
    title: "Places & directions",
    titleSi: "ස්ථාන සහ දිශා",
    description: "Find places and follow simple directions.",
    minutes: 8,
    word: { english: "village", sinhala: "ගම", transliteration: "gama" }
  },
  {
    id: "food",
    title: "Food & water",
    titleSi: "ආහාර සහ වතුර",
    description: "Order essentials and state a need.",
    minutes: 8,
    word: { english: "water", sinhala: "වතුර", transliteration: "vatura" }
  },
  {
    id: "time",
    title: "Time & routines",
    titleSi: "වේලාව සහ දිනචරියාව",
    description: "Describe today, yesterday and tomorrow.",
    minutes: 8,
    word: { english: "yesterday", sinhala: "ඊයේ", transliteration: "īyē" }
  },
  {
    id: "reading",
    title: "Reading foundations",
    titleSi: "කියවීමේ පදනම",
    description: "Connect Sinhala shapes with their sounds.",
    minutes: 9,
    word: { english: "one", sinhala: "එක", transliteration: "eka" }
  },
  {
    id: "travel",
    title: "Travel essentials",
    titleSi: "ගමන් සඳහා අත්‍යවශ්‍ය දේ",
    description: "Use polite survival phrases while travelling.",
    minutes: 9,
    word: { english: "thank you", sinhala: "ස්තුතියි", transliteration: "stutiyi" }
  }
] satisfies NativeLesson[];

export const nativeLessons = z.array(nativeLessonSchema).min(8).parse(nativeLessonSource);
