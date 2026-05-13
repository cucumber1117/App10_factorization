import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  generateRandomQuestions,
  worksheetQuestionCount,
} from "../../data/factorQuestions";
import { practiceLevels } from "../../data/levels";
import styles from "./Worksheet.module.css";

function formatMathText(text) {
  return text
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴");
}

export default function Worksheet() {
  const { level: levelKey } = useParams();
  const level = practiceLevels.find((item) => item.key === levelKey);
  const [questions, setQuestions] = useState(() =>
    generateRandomQuestions(levelKey, worksheetQuestionCount),
  );

  if (!level) {
    return (
      <section className={styles.previewShell}>
        <div className={styles.previewActions}>
          <Link to="/settings" className={styles.backButton}>
            設定へ戻る
          </Link>
        </div>
        <p>この難易度は見つかりませんでした。</p>
      </section>
    );
  }

  return (
    <section className={styles.previewShell}>
      <div className={styles.previewActions}>
        <Link to="/settings" className={styles.backButton}>
          設定へ戻る
        </Link>
        <button
          type="button"
          className={styles.printButton}
          onClick={() =>
            setQuestions(generateRandomQuestions(levelKey, worksheetQuestionCount))
          }
        >
          作り直す
        </button>
        <button
          type="button"
          className={styles.printButton}
          onClick={() => window.print()}
        >
          PDF出力
        </button>
      </div>

      <div className={styles.paper}>
        <header className={styles.paperHeader}>
          <div>
            <p>因数分解 問題用紙</p>
            <h1>{level.title}</h1>
          </div>
          <div className={styles.metaGrid}>
            <span>日付</span>
            <strong />
            <span>名前</span>
            <strong />
            <span>点数</span>
            <strong> / {questions.length}</strong>
          </div>
        </header>

        <p className={styles.instructions}>
          次の式を因数分解しなさい。
        </p>

        <ol className={styles.questionList}>
          {questions.map((question, index) => (
            <li key={question.id} className={styles.questionItem}>
              <div className={styles.questionText}>
                <span>{index + 1}.</span>
                <strong>{formatMathText(question.question)}</strong>
              </div>
              <div className={styles.answerLine} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
