import Fuse from "fuse.js";
import axios from "axios";
import { z } from "zod";

// const envSchema = z.object({
//   VITE_GIST_ID: z.string(),
//   VITE_GIST_TOKEN: z.string(),
// });
//
// const env = envSchema.parse(import.meta.env);

export interface quiz {
  question: string;
  answers: string[];
  threshold?: number;
  cs?: boolean;
}

export async function gather(): Promise<quiz[]> {
  return [
    {
      question: "Who is the first man?",
      answers: ["Adam", "Adan"],
      threshold: 0.1,
    },
  ];
  const { data } = await axios.get(
    `https://api.github.com/gists/${env.VITE_GIST_ID}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.VITE_GIST_TOKEN}`,
      },
    },
  );
  return data;
}

export default async function core(
  quest: quiz,
  answer: string,
): Promise<boolean> {
  const data = await gather();
  const fuse = new Fuse(data, {
    keys: ["answers"],
    threshold: quest.threshold || 0.25,
    isCaseSensitive: quest.cs || false,
  });

  const result = fuse.search(answer);
  const match = result.find((r) => r.item.question === quest.question);
  return !!match;
}
