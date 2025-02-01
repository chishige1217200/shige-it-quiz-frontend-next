import React, { useState, ChangeEvent, useEffect } from "react";
import "../styles/quiz.css";
import Image from "next/image";
import TypingAnimation from "@/components/ui/typing-animation";
import axios from "axios";

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>();
  const [alternativeAnswers, setAlternativeAnswers] = useState<string[]>();
  const [answerEnabled, setAnswerEnabled] = useState<boolean>(false);

  // 入力変更時のイベント
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    alert(`Your answer: `);
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
      setAnswerEnabled(false);
      const response = await axios.get(
        `https://shige-it-quiz-backend.vercel.app/get_quizdata?id=${currentQuestionIndex}`
      );
      const data = response.data;

      console.log(data);

      if (data.question) {
        // 問題情報を状態として保存
        setQuestion(`Q${id}: ` + data.question);
        setAnswerEnabled(true);
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
        disabled={!answerEnabled}
      />

      <div>
        <button className="ans_button" type="button" onClick={handleSubmit} disabled={!answerEnabled}>
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
