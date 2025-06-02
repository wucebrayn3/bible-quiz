import type { quiz } from "../utils/core";

interface prop {
  q: quiz;
}

export default function Base({ q }: prop) {
  console.log("error" + q);
  return (
    <div className="flex flex-col w-1/2 h-1/2 rounded shadow bg-black/25 p-2">
      <h3 className="text-center">Question</h3>
      <h3 className="h-full box-border">{q.question}</h3>
      <input
        className="border-black/50 border-2 border-solid rounded px-2"
        placeholder="Answer"
      />
      <button className="bg-sky-300 my-2 rounded">Answer</button>
    </div>
  );
}
