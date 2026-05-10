import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { factorQuestions } from "../../data/factorQuestions";
import styles from "./PracticeMode.module.css";

function normalizeFactorString(s) {
  return s
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/×/g, "")
    .replace(/\u00D7/g, "");
}

function formatMathText(text) {
  return text
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³");
}

function normalizeNumberInput(value) {
  return value.replace(/[０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0),
  );
}

function makeFactorAnswer({ a1, sign1, n1, a2, sign2, n2, isHard }) {
  if (isHard) {
    const leftCoef = a1 === "1" || a1 === "" ? "x" : `${a1}x`;
    const rightCoef = a2 === "1" || a2 === "" ? "x" : `${a2}x`;

    return `(${leftCoef}${sign1}${n1})(${rightCoef}${sign2}${n2})`;
  }

  return `(x${sign1}${n1})(x${sign2}${n2})`;
}

function getFactorParts(answer) {
  const normalized = normalizeFactorString(answer);
  const matches = normalized.match(/\(([^)]+)\)\(([^)]+)\)/);

  if (!matches) return [];

  return [matches[1], matches[2]].sort();
}

function isSameFactorAnswer(userAnswer, correctAnswer) {
  const userParts = getFactorParts(userAnswer);
  const correctParts = getFactorParts(correctAnswer);

  if (userParts.length !== 2 || correctParts.length !== 2) {
    return false;
  }

  return userParts[0] === correctParts[0] && userParts[1] === correctParts[1];
}

function shuffleQuestions(questions) {
  return [...questions].sort(() => Math.random() - 0.5);
}

const initialAnswer = {
  a1: "1",
  sign1: "+",
  n1: "",
  a2: "1",
  sign2: "+",
  n2: "",
};

export default function PracticeMode({ level, title }) {
  const navigate = useNavigate();
  const [questions] = useState(() =>
    shuffleQuestions(factorQuestions.filter((q) => q.level === level)),
  );
  const isHard = level === "hard";

  const [index, setIndex] = useState(0);
  const [answerParts, setAnswerParts] = useState(initialAnswer);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const total = questions.length;

  function updateAnswer(name, value) {
    const nextValue = ["a1", "n1", "a2", "n2"].includes(name)
      ? normalizeNumberInput(value)
      : value;

    setAnswerParts((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function playFeedback(type) {
    setFeedback(null);
    window.setTimeout(() => {
      setFeedback({ type, id: Date.now() });
    }, 0);
  }

  function check() {
    if (!q) return;

    if (!answerParts.n1 || !answerParts.n2) {
      setMessage("数字を入力してください。");
      playFeedback("notice");
      return;
    }

    if (isHard && (!answerParts.a1 || !answerParts.a2)) {
      setMessage("xの前の数字も入力してください。");
      playFeedback("notice");
      return;
    }

    const userAnswer = makeFactorAnswer({
      ...answerParts,
      isHard,
    });

    if (isSameFactorAnswer(userAnswer, q.answer)) {
      setMessage("正解！");
      playFeedback("correct");
      setScore((s) => s + 1);
    } else {
      setMessage(`不正解。正解: ${formatMathText(q.answer)}`);
      playFeedback("wrong");
    }
  }

  function next() {
    setIndex((i) => Math.min(i + 1, total - 1));
    setAnswerParts(initialAnswer);
    setMessage("");
    setShowHint(false);
    setFeedback(null);
    setShowPassConfirm(false);
  }

  function requestPass() {
    setShowPassConfirm(true);
  }

  function cancelPass() {
    setShowPassConfirm(false);
  }

  function confirmPass() {
    next();
  }

  function finish() {
    setFinished(true);
    setFeedback(null);
    setShowPassConfirm(false);
  }

  function goHome() {
    navigate("/");
  }

  if (!q) {
    return (
      <section className={styles.card}>
        <p className={styles.modeLabel}>Problem Mode</p>
        <h2>{title}の問題</h2>
        <p>このレベルの問題がありません。</p>
      </section>
    );
  }

  const isCorrect = message.startsWith("正解");
  const isWrong = message.startsWith("不正解");
  const hasResult = isCorrect || isWrong;
  const isLastQuestion = index === total - 1;
  const solvedCount = Math.min(index + (hasResult ? 1 : 0), total);

  if (finished) {
    return (
      <section className={styles.summaryCard}>
        <p className={styles.modeLabel}>Result</p>
        <h2>おつかれさま！</h2>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryBox}>
            <span>解いた問題</span>
            <strong>{solvedCount}</strong>
          </div>

          <div className={styles.summaryBox}>
            <span>正解数</span>
            <strong>{score}</strong>
          </div>
        </div>

        <p className={styles.summaryText}>
          {title}モードの結果です。次は別のレベルにも挑戦してみよう。
        </p>

        <button
          type="button"
          className={styles.summaryHomeButton}
          onClick={goHome}
        >
          ホームへ戻る
        </button>
      </section>
    );
  }

  const previewAnswer = makeFactorAnswer({
    ...answerParts,
    n1: answerParts.n1 || "○",
    n2: answerParts.n2 || "○",
    a1: answerParts.a1 || "□",
    a2: answerParts.a2 || "□",
    isHard,
  });

  return (
    <section
      className={`${styles.card} ${
        feedback?.type === "wrong"
          ? styles.wrongCard
          : feedback?.type === "correct"
            ? styles.correctCard
            : feedback?.type === "notice"
              ? styles.noticeCard
              : ""
      }`}
    >
      {feedback?.type === "correct" && (
        <div key={feedback.id} className={styles.confettiLayer} aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={styles.confettiPiece} />
          ))}
          <strong className={styles.resultPop}>正解!</strong>
        </div>
      )}

      {feedback?.type === "wrong" && (
        <div key={feedback.id} className={styles.retryPop} aria-hidden="true">
          もう一回!
        </div>
      )}

      <div className={styles.topRow}>
        <div>
          <p className={styles.modeLabel}>Problem Mode</p>
          <h2>{title}の問題</h2>
        </div>

        <div
          className={`${styles.scoreBox} ${
            feedback?.type === "correct" ? styles.scoreBoost : ""
          }`}
        >
          <span>Score</span>
          <strong>{score}</strong>
        </div>
      </div>

      <div className={styles.progressArea}>
        <span>
          問題 {index + 1} / {total}
        </span>

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.questionBox}>
        <p className={styles.questionLabel}>次を因数分解しなさい</p>
        <div className={styles.question}>{formatMathText(q.question)}</div>
      </div>

      <div className={styles.answerArea}>
        <p className={styles.inputLabel}>答え</p>

        <div className={styles.answerFormula}>
          <span className={styles.bigParen}>(</span>

          <div className={styles.factorBox}>
            {isHard && (
              <input
                className={styles.coefInput}
                value={answerParts.a1}
                onChange={(e) => updateAnswer("a1", e.target.value)}
                placeholder="□"
                inputMode="numeric"
              />
            )}

            <span className={styles.xText}>x</span>

            <div className={styles.signToggle} aria-label="1つ目の符号">
              <button
                type="button"
                className={
                  answerParts.sign1 === "+"
                    ? styles.activeSignButton
                    : styles.signButton
                }
                onClick={() => updateAnswer("sign1", "+")}
              >
                +
              </button>
              <button
                type="button"
                className={
                  answerParts.sign1 === "-"
                    ? styles.activeSignButton
                    : styles.signButton
                }
                onClick={() => updateAnswer("sign1", "-")}
              >
                −
              </button>
            </div>

            <input
              className={styles.numberInput}
              value={answerParts.n1}
              onChange={(e) => updateAnswer("n1", e.target.value)}
              placeholder="○"
              inputMode="numeric"
            />
          </div>

          <span className={styles.bigParen}>)</span>

          <span className={styles.bigParen}>(</span>

          <div className={styles.factorBox}>
            {isHard && (
              <input
                className={styles.coefInput}
                value={answerParts.a2}
                onChange={(e) => updateAnswer("a2", e.target.value)}
                placeholder="□"
                inputMode="numeric"
              />
            )}

            <span className={styles.xText}>x</span>

            <div className={styles.signToggle} aria-label="2つ目の符号">
              <button
                type="button"
                className={
                  answerParts.sign2 === "+"
                    ? styles.activeSignButton
                    : styles.signButton
                }
                onClick={() => updateAnswer("sign2", "+")}
              >
                +
              </button>
              <button
                type="button"
                className={
                  answerParts.sign2 === "-"
                    ? styles.activeSignButton
                    : styles.signButton
                }
                onClick={() => updateAnswer("sign2", "-")}
              >
                −
              </button>
            </div>

            <input
              className={styles.numberInput}
              value={answerParts.n2}
              onChange={(e) => updateAnswer("n2", e.target.value)}
              placeholder="○"
              inputMode="numeric"
            />
          </div>

          <span className={styles.bigParen}>)</span>
        </div>

        <div className={styles.previewBox}>
          入力中：{formatMathText(previewAnswer)}
        </div>
      </div>

      {!hasResult && (
        <div className={styles.buttonRow}>
          <button type="button" className={styles.primaryButton} onClick={check}>
            答え合わせ
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setShowHint((s) => !s)}
          >
            ヒント
          </button>
        </div>
      )}

      {showHint && (
        <div className={styles.hintBox}>💡 {formatMathText(q.hint)}</div>
      )}

      {message && (
        <div
          className={
            isCorrect
              ? styles.correctMessage
              : isWrong
                ? styles.wrongMessage
                : styles.normalMessage
          }
        >
          {message}
        </div>
      )}

      {isWrong && (
        <div className={styles.explanationBox}>
          <strong>解説</strong>
          <p>{formatMathText(q.explanation)}</p>
        </div>
      )}

      {hasResult ? (
        <div className={styles.resultPanel}>
          <div>
            <span className={styles.resultLabel}>
              {isCorrect ? "Great!" : "Review"}
            </span>
            <strong>{isCorrect ? "その調子！" : "解説を見て進もう"}</strong>
            <p>
              Score {score} / {index + 1}
            </p>
          </div>

          <div className={styles.resultActions}>
            <button
              type="button"
              className={styles.resultEndButton}
              onClick={finish}
            >
              終了
            </button>

            <button
              type="button"
              className={styles.resultNextButton}
              onClick={next}
              disabled={isLastQuestion}
            >
              {isLastQuestion ? "最後の問題" : "次へ"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.passRow}>
          <button
            type="button"
            className={styles.endButton}
            onClick={finish}
          >
            終了
          </button>

          <button
            type="button"
            className={styles.moveButton}
            onClick={requestPass}
            disabled={index === total - 1}
          >
            パス
          </button>
        </div>
      )}

      {showPassConfirm && !hasResult && (
        <div className={styles.passConfirm} role="alertdialog" aria-modal="false">
          <strong>この問題をパスしますか？</strong>
          <p>入力中の答えはリセットされます。</p>
          <div className={styles.passActions}>
            <button
              type="button"
              className={styles.passCancelButton}
              onClick={cancelPass}
            >
              戻る
            </button>
            <button
              type="button"
              className={styles.passOkButton}
              onClick={confirmPass}
            >
              パスする
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
