import React, { useState, useEffect } from "react";
import Image from "next/image";
import TypingAnimation from "@/components/ui/typing-animation";
import axios from "axios";
import confetti from "canvas-confetti";

interface quizProps {
  id: number;
  count: number;
}

const App: React.FC<quizProps> = ({ id, count }: quizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    count !== 0 ? id % count : 0
  );
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [alternativeAnswers, setAlternativeAnswers] = useState<string[]>();
  const [answerEnabled, setAnswerEnabled] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  // 次の問題に進む
  const handleNext = () => {
    if (currentQuestionIndex < count - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 前の問題に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 解答を送信する
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer === inputValue) {
      showFrame();
      if (currentQuestionIndex < count - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      return;
    }
    if (alternativeAnswers?.includes(inputValue)) {
      showFrame();
      if (currentQuestionIndex < count - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      return;
    }
    alert("不正解...");
  };

  const showFrame = () => {
    const end = Date.now() + 1 * 1000; // 1 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  // 問題情報を取得する
  const fetchQuizData = async (id: string) => {
    try {
      setQuestion("");
      setInputValue("");
      setAnswerEnabled(false);
      const response = await axios.get(
        `https://shige-it-quiz-backend.vercel.app/get_quizdata?id=${currentQuestionIndex}`
      );
      const data = response.data;

      // console.log(data);

      if (data.question) {
        // 問題情報を状態として保存
        setQuestion(`Q${id}: ` + data.question);
        setAnswer(data.answer);
        setAlternativeAnswers(data.alternativeAnswers);
        setAnswerEnabled(true);
      } else {
        setQuestion(`Q${id}: 問題情報が存在しません。`);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuizData(currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  return (
    <div className="App">
      <header className="App-header">
        <Image
          className="App-logo"
          src="/quiz.png"
          width={320}
          height={320}
          alt="logo"
        />
      </header>

      <div className="radius">
        <TypingAnimation className="question-text" duration={200}>
          {question}
        </TypingAnimation>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-area"
          placeholder="回答を入力してください"
          value={inputValue}
          disabled={!answerEnabled}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div>
          <button
            className="ans_button"
            type="submit"
            disabled={!answerEnabled}
          >
            解　答
          </button>
        </div>
      </form>
      <div className="prob-change-btn">
        <button
          className="previous-btn"
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex <= 0}
        >
          前の問題
        </button>
        <button
          className="next-btn"
          type="button"
          onClick={handleNext}
          disabled={currentQuestionIndex >= count - 1}
        >
          次の問題
        </button>
      </div>
    </div>
  );
};

export default App;
