import { Link } from "react-router-dom";
import { practiceLevels } from "../../data/levels";
import styles from "./ProblemSelect.module.css";

export default function ProblemSelect() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <p className={styles.modeLabel}>Problem Mode</p>
        <h2>問題</h2>
        <p className={styles.description}>
          難易度を選んで、選択したレベルの問題に進みます。
        </p>
      </div>

      <div className={styles.levelGrid}>
        {practiceLevels.map((level) => (
          <Link
            key={level.key}
            to={`/practice/${level.key}`}
            className={styles.levelCard}
          >
            <div className={styles.icon}>{level.icon}</div>
            <div className={styles.levelText}>
              <span>ランダム生成</span>
              <h3>{level.title}</h3>
              <p>{level.description}</p>
            </div>
            <strong>開始</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
