import React, { useState, useEffect } from "react";
import Image from "next/image";
import TypingAnimation from "@/components/ui/typing-animation";
import axios from "axios";

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [alternativeAnswers, setAlternativeAnswers] = useState<string[]>();
  const [answerEnabled, setAnswerEnabled] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  // 次の問題に進む
  const handleNext = () => {
    if (currentQuestionIndex < questionCount - 1) {
      setInputValue("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 前の問題に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setInputValue("");
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 解答を送信する
  const handleSubmit = () => {
    if (answer === inputValue) {
      alert("answerで正解!");
      return;
    }
    if (alternativeAnswers?.includes(inputValue)) {
      alert("alternativeAnswersで正解!");
      return;
    }
    alert("不正解...");
  };

  // 問題数を取得する
  const fetchQuizCount = async () => {
    try {
      const response = await axios.get(
        `https://shige-it-quiz-backend.vercel.app/get_quizcount`
      );
      const data = response.data;

      // console.log(data);

      if (data.count) {
        // 問題数情報を状態として保存
        setQuestionCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching questionCount:", error);
    }
  };

  // 問題情報を取得する
  const fetchQuizData = async (id: string) => {
    try {
      setQuestion("");
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
        value={inputValue}
        disabled={!answerEnabled}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div>
        <button
          className="ans_button"
          type="button"
          onClick={handleSubmit}
          disabled={!answerEnabled}
        >
          解　答
        </button>
      </div>
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
          disabled={currentQuestionIndex >= questionCount - 1}
        >
          次の問題
        </button>
      </div>
    </div>
  );
};

export default App;
