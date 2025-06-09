import { useEffect, useState } from "react";
import core, { gather, type quiz } from "../utils/core";

export default function Base() {
  const [questions, setQuestions] = useState<quiz[]>([]);
  const [pattern, setPattern] = useState<number[]>([]);
  const [n, setNumber] = useState<number>(-1);
  const [question, setQuestion] = useState<quiz>();
  const [qAnswer, setqAnswer] = useState("");
  const [score, setScore] = useState(0);

  const reset = () => {
    console.log("Reset");
  };

  useEffect(() => {
    const isVis = () => {
      if (document.hidden || !window.focus) {
        reset();
      }
    };
    document.addEventListener("visibilitychange", isVis);
    return () => {
      document.removeEventListener("visibilitychange", isVis);
    };
  }, [document.hidden]);

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
    setTimeout(() => {
      if (pattern.length && n === -1) {
        setNumber(0);
        setQuestion(questions[pattern[0]]);
      }
    }, 2500);
  }, [pattern]);

  const answer = () => {
    if (n < pattern.length && question) {
      const verif = core(question, qAnswer, questions);

      if (verif) {
        setScore((prev) => prev + 1);
      }
      if (n < pattern.length) {
        const next = n + 1;
        setNumber(next);

        if (questions[pattern[next]]) {
          setQuestion(questions[pattern[next]]);
        }
      }
    }
    setqAnswer("");
  };

  return (
    <div
      onBlur={reset}
      className="flex flex-col md:w-3/4 md:h-3/4 w-full h-full dark:text-white dark:bg-slate-700 dark:bg-linear-br dark:bg-linear-300 dark:from-slate-700 dark:to-slate-500 dark:shadow-slate-500 to-150% rounded-md shadow-2xl shadow-gray-300 p-4"
    >
      <h3 className="text-center text-xl">
        {n >= 0 ? `Question #${n + 1}` : "Bible Quiz Game"}
      </h3>
      <div className="flex flex-col p-10 md:p-0 h-full w-full justify-center items-center box-border">
        <h3 className="text-xl md:text-3xl text-center">
          {n < pattern.length
            ? (question?.qe ?? "Would you like to start")
            : `Your Score: ${score}`}
        </h3>
        <h3 className="text-md md:text-lg italic text-center">
          {n < pattern.length
            ? (question?.qt ?? "Gusto mo na mag siumula? Wag na.")
            : ""}
        </h3>
      </div>
      <div className="flex w-full border-white border-2 border-solid rounded-xl overflow-hidden">
        <input
          value={qAnswer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setqAnswer(e.currentTarget.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              answer();
            }
          }}
          type="text"
          className="px-2 md:text-md py-2 outline-none box-sizing w-full"
          placeholder="Answer"
        />
        <button
          onClick={answer}
          className="bg-slate-700 dark:text-black dark:bg-white px-2  md:text-xl"
        >
          {qAnswer.length > 0 ? "Answer" : "Next"}
        </button>
      </div>
    </div>
  );
}
