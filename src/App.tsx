import { useEffect, useState } from "react";
import core, { gather } from "./utils/core";
import Base from "./components/base";

export default function App() {
  const [question, setQuestion] = useState([{ qe: "Hi", answers: ["hello"] }]);
  const [pattern, setPattern] = useState([1, 2]);

  useEffect(() => {
    (async () => {
      const q = await gather();
      setQuestion(q);

      const list: number[] = [];
      for (let i = 0; q.length; i++) {
        let x = Math.floor(Math.random() * q.length);
        while (list.includes(x)) {
          x = Math.floor(Math.random() * q.length);
        }
        list.push(x);
      }
      setPattern(list);
    })();
  }, []);

  return (
    <div className="flex justify-center items-center w-dvw h-dvh">
      <Base question={question} pattern={pattern} />
    </div>
  );
}
