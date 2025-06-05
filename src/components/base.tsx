import { useEffect, useState } from "react";
import core, { gather, type quiz } from "../utils/core";

export default function Base() {
  const [questions, setQuestions] = useState<quiz[]>([]);
  const [pattern, setPattern] = useState<number[]>([]);
  const [n, setNumber] = useState<number>(-1);
  const [question, setQuestion] = useState<quiz>({});
  const [qAnswer, setqAnswer] = useState("");
  const [state, setState] = useState("Start Now");
  const [score, setScore] = useState(0);

  useEffect(() => {
    (async () => {
      const q = await gather();
      setQuestions(q);
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const p: number[] = [];
    for (let i = 0; i < questions.length; i++) {
      let x = Math.floor(Math.random() * questions.length);
      while (p.includes(x)) {
        x = Math.floor(Math.random() * questions.length);
      }
      p.push(x);
    }
    setPattern(p);
  }, [questions]);

  useEffect(() => {
    if (pattern.length && n === -1) {
      setNumber(0);
      setQuestion(questions[pattern[0]]);
      setState("Answer");
    }
  }, [pattern]);

  const answer = () => {
    if (n < pattern.length) {
      const verif = core(question, qAnswer, questions);
      console.log(verif);
      if (verif) {
        setScore((prev) => prev + 1);
      }
      if (n < pattern.length) {
        const next = n + 1;
        setNumber(next);

        if (questions[pattern[next]]) {
          setQuestion(questions[pattern[next]]);
        } else {
          alert(score);
        }
      } else {
        alert(score);
      }
    }
  };

  return (
    <div className="flex flex-col w-1/2 h-1/2 rounded shadow bg-black/25 p-2">
      <h3 className="text-center text-xl">Question</h3>
      <h3 className="flex h-full w-full justify-center items-center box-border">
        {question.qe ?? "Would you like to start"}
      </h3>
      <h3 className="flex w-full text-sm items-center justify-center box-border">
        {question.qt ?? "Gusto mo na mag siumula? Wag na."}
      </h3>
      <input
        onChange={(e: React.ChangeEventHandler<HTMLInputElement>) => {
          if (e.target.value) {
            setqAnswer(e.target.value);
          }
        }}
        className="border-black/50 border-2 border-solid rounded px-2"
        placeholder="Answer"
      />
      <button onClick={answer} className="bg-sky-300 my-2 rounded">
        {state}
      </button>
    </div>
  );
}
