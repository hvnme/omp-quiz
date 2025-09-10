import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp
      tg.expand()
    }
  }, [])

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/server");
        const json = await res.json();

        if (json.status === "ok" && json.data?.victorina4webapp) {
          const parsed = JSON.parse(json.data.victorina4webapp);

          const quizzesArray = Object.values(parsed).map((quiz) => {
            const normalizedQuestions = quiz.questions.map((q) => {
              const optionsArray = q.options
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => line.replace(/^(?:[а-яА-Яa-zA-Z]\.?|\d+)[.)]?\s*/, ""));

              return {
                question: q.title,
                options: optionsArray,
                correct: null,
              };
            });

            return {
              id: quiz.id,
              title: quiz.title,
              questions: normalizedQuestions,
            };
          });

          setQuizzes(quizzesArray);
        }
      } catch (err) {
        console.error("Помилка завантаження:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleAnswerClick = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSelectedQuiz(null);
    setQuestions([]);
  };

  if (loading) {
    return <div className="App">⏳ Завантаження вікторин...</div>;
  }

  if (!selectedQuiz) {
    return (
      <div className="App">
        <div className="quiz-header-outside">
          <div className="quiz-title">Оберіть вікторину зі списку 👇</div>
        </div>
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="quiz-card"
              onClick={() => {
                setSelectedQuiz(quiz);
                setQuestions(quiz.questions);
              }}
            >
              <h3>{quiz.title}</h3>
              <p>{quiz.questions.length} запитань</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentQuestionIndex >= questions.length ? (
        <div className="completion-card">
          <h2>Дякую за участь у вікторині!</h2>
          <button onClick={handleRestart} className="next-button">
            Повернутись до вибору
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-header-outside">
            <div className="quiz-title">{selectedQuiz.title}</div>
            <div className="quiz-meta-row">
              <div className="progress-bar-container">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* <span className="question-number">
                Питання {currentQuestionIndex + 1}/{questions.length}
              </span> */}
              <span className="datetime">{formatDateTime(currentDateTime)}</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="question-card"
            >
              <h2>
                {currentQuestion.question}
              </h2>
              <div className="options-container">
                {currentQuestion.options.map((option, index) => {
                  const letters = ["а", "б", "в", "г", "д", "е", "є", "ж", "з"];
                  const letter = letters[index]
                    ? letters[index]
                    : String.fromCharCode(1072 + index);
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`option-button ${
                        selectedOption === index ? "selected" : ""
                      }`}
                    >
                      <span
                        style={{
                          marginRight: 8,
                          textTransform: "lowercase",
                          fontWeight: "normal",
                        }}
                      >
                        {letter}.
                      </span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                onClick={handleNextQuestion}
                className="next-button"
                disabled={selectedOption === null}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Завершити вікторину"
                  : "Наступне запитання"}
              </motion.button>

            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default App;
