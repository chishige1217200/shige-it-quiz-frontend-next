import React, { useState, ChangeEvent } from "react";
import "../styles/quiz.css";
// import Image from "next/image";
import TypingAnimation from "@/components/ui/typing-animation";

// クイズデータの型定義
interface Quiz {
  id: number;
  question: string;
}

const quizData: Quiz[] = [
  { id: 1, question: "What is the capital of France?" },
  { id: 2, question: "What is 2 + 2?" },
  { id: 3, question: "What is the capital of Japan?" },
];

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(quizData.length).fill("")
  );

  // 入力変更時のイベント
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  // 次の質問に進む
  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 前の質問に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 解答を送信
  const handleSubmit = () => {
    alert(`Your answer: ${answers[currentQuestionIndex]}`);
  };

  return (
    <div className="App">
      {/* <header>
        <Image
          className="dark:invert"
          src="/quiz.png"
          alt="Quiz Logo"
          width={100}
          height={100}
        />
        <h1>Quiz App</h1>
      </header> */}
      <main>
        <div className="question-container">
          <h2>Question {currentQuestionIndex + 1}:</h2>
          <TypingAnimation>
            {quizData[currentQuestionIndex].question}
          </TypingAnimation>
        </div>
        <div className="answer-container">
          <input
            type="text"
            value={answers[currentQuestionIndex]}
            onChange={handleInputChange}
            placeholder="Enter your answer"
          />
        </div>
        <div className="button-container">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous Question
          </button>
          <button onClick={handleSubmit}>Submit</button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === quizData.length - 1}
          >
            Next Question
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
