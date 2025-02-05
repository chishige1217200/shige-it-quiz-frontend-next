import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Quiz from "./quiz";

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    fetchQuizCount();
  }, []);

  useEffect(() => {
    if (!router.isReady) return; // ルーターの準備ができていない場合は処理しない

    const { id } = router.query;

    console.log(id);

    if (!id) {
      setCurrentQuestionIndex(0);
      return;
    }
    if (Array.isArray(id) || isNaN(Number(id))) {
      return;
    }

    setCurrentQuestionIndex(Number(id));
  }, [router.isReady, router.query.id]);

  return (
    <>
      {currentQuestionIndex !== null && questionCount !== null ? (
        <Quiz id={currentQuestionIndex} count={questionCount} />
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
