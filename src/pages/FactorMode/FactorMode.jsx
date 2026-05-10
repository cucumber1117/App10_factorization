import { useState } from "react";
import { factorQuestions } from "../../data/factorQuestions";
import styles from "./FactorMode.module.css";

function normalizeExpression(value) {
  return value
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace(/ｘ/g, "x")
    .replace(/Ｘ/g, "x")
    .replace(/X/g, "x")
    .replace(/²/g, "^2")
    .replace(/３/g, "3")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function formatMathText(text) {
  return text
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³");
}

export default function FactorMode() {
  const [input, setInput] = useState("x^2 + 5x + 6");
  const [result, setResult] = useState(null);

  const examples = ["x^2 + 5x + 6", "x^2 - 9", "x^2 + 7x + 12", "2x^2 + 7x + 3"];

  function calculate() {
    const normalizedInput = normalizeExpression(input);
    const match = factorQuestions.find(
      (question) => normalizeExpression(question.question) === normalizedInput,
    );

    setResult(
      match
        ? { status: "found", answer: match.answer }
        : { status: "empty", answer: "" },
    );
  }

  function chooseExample(example) {
    setInput(example);
    const match = factorQuestions.find((question) => question.question === example);
    setResult(match ? { status: "found", answer: match.answer } : null);
  }

  return (
    <section className={styles.card}>
      <div className={styles.topArea}>
        <div>
          <p className={styles.modeLabel}>Calculator Mode</p>
          <h2>因数分解計算</h2>
          <p className={styles.description}>
            式を入力して確認する画面です。計算アプリのように、式が大きく見えるUIにしています。
          </p>
        </div>

        <div className={styles.calcIcon}>🧮</div>
      </div>

      <div className={styles.display}>
        <span>入力式</span>
        <strong>{formatMathText(input || "式を入力してください")}</strong>
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder="例: x^2 + 5x + 6"
        />

        <button type="button" className={styles.button} onClick={calculate}>
          因数分解
        </button>
      </div>

      <div
        className={`${styles.previewBox} ${
          result?.status === "found" ? styles.foundResult : ""
        }`}
      >
        <span>結果</span>
        <strong>
          {result?.status === "found"
            ? formatMathText(result.answer)
            : result?.status === "empty"
              ? "登録済みの例題から見つかりませんでした"
              : "式を入力して因数分解を押してください"}
        </strong>
      </div>

      <div className={styles.exampleArea}>
        <p>例題から選ぶ</p>

        <div className={styles.exampleGrid}>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              className={styles.exampleButton}
              onClick={() => chooseExample(example)}
            >
              {formatMathText(example)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
