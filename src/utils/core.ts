import Fuse from "fuse.js";
import axios from "axios";
import { z } from "zod";

const envSchema = z.object({
  VITE_GIST_ID: z.string(),
  VITE_GIST_TOKEN: z.string(),
  VITE_GIST_FILE: z.string(),
});

const env = envSchema.parse(import.meta.env);

export interface quiz {
  qe: string;
  qt?: string;
  answers: string[];
  threshold?: number;
  cs?: boolean;
}

export async function gather(): Promise<quiz[]> {
  const { data } = await axios.get(
    `https://api.github.com/gists/${env.VITE_GIST_ID}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.VITE_GIST_TOKEN}`,
      },
    },
  );
  return JSON.parse(data.files[env.VITE_GIST_FILE].content);
}

export default function core(
  quest: quiz,
  answer: string,
  data: quiz[],
): boolean {
  // Normalize the answer list
  const normalizedData = data.map((item) => ({
    ...item,
    answers: Array.isArray(item.answers)
      ? item.answers
      : item.answer
        ? [item.answer]
        : [],
  }));

  // 1. Try exact match first (respects case-sensitivity)
  const exactMatch = normalizedData.find((item) => {
    if (item.qe !== quest.qe) return false;
    return item.answers.some((ans) =>
      quest.cs ? ans === answer : ans.toLowerCase() === answer.toLowerCase(),
    );
  });

  if (exactMatch) return true;

  // 2. Fallback to fuzzy match (if answer is long enough)
  if (answer.length < 2) return false;

  const fuse = new Fuse(normalizedData, {
    keys: ["answers"],
    threshold: quest.threshold ?? 0.25,
    isCaseSensitive: quest.cs ?? false,
  });

  const result = fuse.search(answer);
  const match = result.find((r) => r.item.qe === quest.qe);

  return !!match;
}
