import Fuse from "fuse.js";
import axios from "axios";
import { readFileSync } from "fs";
import { z } from "zod";

// const envSchema = z.object({
//   VITE_GIST_ID: z.string(),
//   VITE_GIST_TOKEN: z.string(),
// });
//
// const env = envSchema.parse(import.meta.env);

export interface quiz {
  qe: string;
  qt?: string;
  answers: string[];
  threshold?: number;
  cs?: boolean;
}

export async function gather(): Promise<quiz[]> {
  const x = JSON.parse(readFileSync("src/data.json", "utf-8"));
  return x;
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
