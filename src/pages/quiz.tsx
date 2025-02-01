import React, { useState, ChangeEvent, useEffect } from "react";
import "../styles/quiz.css";
import Image from "next/image";
import TypingAnimation from "@/components/ui/typing-animation";
import axios from "axios";
import { count } from "console";

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
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
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
    if (currentQuestionIndex < questionCount) {
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

  const fetchQuizCount = async () => {
    try {
      const response = await axios.get(
        `https://shige-it-quiz-backend.vercel.app/get_quizcount`
      );
      const data = response.data;

      console.log(data);

      if (data.count) {
        // 問題数情報を状態として保存
        setQuestionCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching questionCount:", error);
    }
  };

  const fetchQuizData = async (id: string) => {
    try {
      const response = await axios.get(
        `https://shige-it-quiz-backend.vercel.app/get_quizdata?id=${currentQuestionIndex}`
      );
      const data = response.data;

      console.log(data);

      if (data.question) {
        // 問題情報を状態として保存
        setQuestion(`Q${id}: ` + data.question);
      } else {
        setQuestion(`Q${id}: 問題情報が存在しません。`);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuizCount();
  }, []);

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

      <input
        type="text"
        className="input-area"
        placeholder="回答を入力してください"
      />

      <div>
        <button className="ans_button" type="button" onClick={handleSubmit}>
          解　答
        </button>
      </div>
      <div className="prob-change-btn">
        <button className="previous-btn" type="button" onClick={handlePrevious}>
          前の問題
        </button>
        <button className="next-btn" type="button" onClick={handleNext}>
          次の問題
        </button>
      </div>
    </div>
  );
};

export default App;
