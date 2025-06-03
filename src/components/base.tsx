import { useState } from "react";
import type { quiz } from "../utils/core";

interface prop {
  question: quiz[];
  pattern: number[];
}

export default function Base({ question, pattern }: prop) {
  const [s, ss] = useState(0);
  const [p, sp] = useState(0);
  const [a, sa] = useState("");

  const answer = () => {
    alert(a);
  };

  console.log(question);
  return (
    <div className="flex flex-col w-1/2 h-1/2 rounded shadow bg-black/25 p-2">
      <h3 className="text-center text-xl">Question</h3>
      <h3 className="flex h-full w-full justify-center items-center box-border">
        {question[p].qe}
      </h3>
      <h3 className="flex w-full text-sm items-center justify-center box-border">
        {question[p].qt ?? ""}
      </h3>
      <input
        onChange={(e: React.ChangeEventHandler<HTMLInputElement>) => {
          if (e.target.value) {
            sa(e.target.value);
          }
        }}
        className="border-black/50 border-2 border-solid rounded px-2"
        placeholder="Answer"
      />
      <button onClick={answer} className="bg-sky-300 my-2 rounded">
        Answer
      </button>
    </div>
  );
}
