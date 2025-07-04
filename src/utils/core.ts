import Fuse from "fuse.js";
import axios from "axios";

export interface quiz {
  qe: string;
  qt?: string;
  answers: string[];
  threshold?: number;
  cs?: boolean;
}

export async function gather(): Promise<quiz[]> {
  const { data } = await axios.get(
    `https://gist.github.com/wucebrayn3/53596fea88ebd2a7c131002fc004c82a`,
  );
  return JSON.parse(data.files["list.json"].content);
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
      : item.answers
        ? [item.answers]
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
