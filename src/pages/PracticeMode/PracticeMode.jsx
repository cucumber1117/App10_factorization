import React, { useEffect, useState } from "react";
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

const initialAnswer = {
  a1: "1",
  sign1: "+",
  n1: "",
  a2: "1",
  sign2: "+",
  n2: "",
};

export default function PracticeMode({ level, title }) {
  const questions = factorQuestions.filter((q) => q.level === level);
  const isHard = level === "hard";

  const [index, setIndex] = useState(0);
  const [answerParts, setAnswerParts] = useState(initialAnswer);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const total = questions.length;

  useEffect(() => {
    setIndex(0);
    setAnswerParts(initialAnswer);
    setMessage("");
    setShowHint(false);
    setScore(0);
  }, [level]);

  function updateAnswer(name, value) {
    setAnswerParts((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function check() {
    if (!q) return;

    if (!answerParts.n1 || !answerParts.n2) {
      setMessage("数字を入力してください。");
      return;
    }

    if (isHard && (!answerParts.a1 || !answerParts.a2)) {
      setMessage("xの前の数字も入力してください。");
      return;
    }

    const userAnswer = makeFactorAnswer({
      ...answerParts,
      isHard,
    });

    if (isSameFactorAnswer(userAnswer, q.answer)) {
      setMessage("正解！");
      setScore((s) => s + 1);
    } else {
      setMessage(`不正解。正解: ${formatMathText(q.answer)}`);
    }
  }

  function next() {
    setIndex((i) => Math.min(i + 1, total - 1));
    setAnswerParts(initialAnswer);
    setMessage("");
    setShowHint(false);
  }

  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
    setAnswerParts(initialAnswer);
    setMessage("");
    setShowHint(false);
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

  const previewAnswer = makeFactorAnswer({
    ...answerParts,
    n1: answerParts.n1 || "○",
    n2: answerParts.n2 || "○",
    a1: answerParts.a1 || "□",
    a2: answerParts.a2 || "□",
    isHard,
  });

  return (
    <section className={styles.card}>
      <div className={styles.topRow}>
        <div>
          <p className={styles.modeLabel}>Problem Mode</p>
          <h2>{title}の問題</h2>
        </div>

        <div className={styles.scoreBox}>
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

            <select
              className={styles.signSelect}
              value={answerParts.sign1}
              onChange={(e) => updateAnswer("sign1", e.target.value)}
            >
              <option value="+">+</option>
              <option value="-">−</option>
            </select>

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

            <select
              className={styles.signSelect}
              value={answerParts.sign2}
              onChange={(e) => updateAnswer("sign2", e.target.value)}
            >
              <option value="+">+</option>
              <option value="-">−</option>
            </select>

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

      <div className={styles.moveButtons}>
        <button
          type="button"
          className={styles.moveButton}
          onClick={prev}
          disabled={index === 0}
        >
          前へ
        </button>

        <button
          type="button"
          className={styles.moveButton}
          onClick={next}
          disabled={index === total - 1}
        >
          次へ
        </button>
      </div>
    </section>
  );
}