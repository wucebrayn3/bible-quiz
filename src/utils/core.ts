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
  // const x = JSON.parse(readFileSync("src/data.json", "utf-8"));
  // return x;
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
  const normalizedData = data.map((item) => ({
    ...item,
    answers: Array.isArray(item.answers)
      ? item.answers
      : item.answer
        ? [item.answer]
        : [],
  }));

  const fuse = new Fuse(normalizedData, {
    keys: ["answers"], // 🔑 this is the field name in the objects
    threshold: quest.threshold ?? 0.25,
    isCaseSensitive: quest.cs ?? false,
  });

  const result = fuse.search(answer);
  const match = result.find((r) => r.item.qe === quest.qe);
  return !!match;
}
