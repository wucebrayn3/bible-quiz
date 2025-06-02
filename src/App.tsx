import { useEffect, useState } from "react";
import core, { gather } from "./utils/core";
import Base from "./components/base";

export default function App() {
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState("");
  const [quest, setQuest] = useState({
    question: "Please click Try to start",
    answers: [""],
    threshold: 0,
  });

  const startNow = () => {
    const quest_ = question[Math.floor(Math.random() * question.length)];
    console.log(quest_);
    setQuest(quest_);
  };

  const answerNow = () => {
    (async () => {
      const x = await core(quest, answer);
    })();
  };

  useEffect(() => {
    (async () => {
      const q = await gather();
      setQuestion(q);
      const quest_ = q[Math.floor(Math.random() * q.length)];
      console.log(quest);
      setQuest(quest_);
    })();
  }, []);

  return (
    <div className="flex justify-center items-center w-dvw h-dvh">
      {/* {q.question} */}
      {/* <input */}
      {/*   onChange={(e: React.ChangeEventHandler<HTMLInputElement>) => { */}
      {/*     setAnswer(e.target.value); */}
      {/*   }} */}
      {/* /> */}
      {/* <button onClick={startNow}>{start}</button> */}
      {/* {alert(JSON.stringify(quest))} */}
      <Base q={quest} />
    </div>
  );
}
