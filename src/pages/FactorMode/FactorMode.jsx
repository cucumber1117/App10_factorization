import React, { useState } from "react";
import styles from "./FactorMode.module.css";

export default function FactorMode() {
  const [input, setInput] = useState("x^2 + 5x + 6");

  const examples = ["x^2 + 5x + 6", "x^2 - 9", "x^2 + 7x + 12", "2x^2 + 7x + 3"];

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
        <strong>{input || "式を入力してください"}</strong>
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例: x^2 + 5x + 6"
        />

        <button type="button" className={styles.button}>
          因数分解
        </button>
      </div>

      <div className={styles.exampleArea}>
        <p>例題から選ぶ</p>

        <div className={styles.exampleGrid}>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              className={styles.exampleButton}
              onClick={() => setInput(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.previewBox}>
        <span>結果表示エリア</span>
        <strong>ここに因数分解の結果を表示</strong>
      </div>
    </section>
  );
}