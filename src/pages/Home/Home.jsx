import { Link } from "react-router-dom";
import { practiceLevels } from "../../data/levels";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroPanel}>
          <div className={styles.heroText}>
            <p className={styles.label}>Factorization Trainer</p>
            <h1>因数分解を30問ずつテンポよく</h1>
            <p className={styles.description}>
              ランダム生成の問題を解いて、30問ごとに結果を確認できます。
            </p>
          </div>

          <div className={styles.heroButtons}>
            <Link to="/practice" className={styles.primaryButton}>
              問題を始める
            </Link>

            <Link to="/calculate" className={styles.secondaryButton}>
              計算する
            </Link>
          </div>
        </div>

        <div className={styles.practicePanel}>
          <div className={styles.previewHeader}>
            <span>Today</span>
            <strong>30</strong>
          </div>

          <div className={styles.previewQuestion}>x² + 5x + 6</div>

          <div className={styles.previewAnswer}>
            <span>(x + 2)</span>
            <span>(x + 3)</span>
          </div>

          <div className={styles.previewFooter}>
            <span>Random</span>
            <strong>∞</strong>
          </div>
        </div>
      </section>

      <section className={styles.levelSection}>
        <div className={styles.sectionTitle}>
          <span>LEVEL</span>
          <h2>難易度</h2>
        </div>

        <div className={styles.levelGrid}>
          {practiceLevels.map((level) => (
            <Link
              key={level.key}
              to={`/practice/${level.key}`}
              className={styles.levelCard}
            >
              <span className={styles.levelIcon}>{level.icon}</span>
              <strong>{level.title}</strong>
              <small>{level.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.menuGrid}>
        <Link to="/practice" className={styles.menuCard}>
          <div className={styles.icon}>?</div>
          <div>
            <h2>問題</h2>
            <p>5段階から選ぶ。</p>
          </div>
        </Link>

        <Link to="/settings" className={styles.menuCard}>
          <div className={styles.icon}>PDF</div>
          <div>
            <h2>PDF</h2>
            <p>問題用紙を作る。</p>
          </div>
        </Link>

        <Link to="/calculate" className={styles.menuCard}>
          <div className={styles.icon}>=</div>
          <div>
            <h2>計算</h2>
            <p>式を入力して確認。</p>
          </div>
        </Link>

        <Link to="/settings" className={styles.menuCard}>
          <div className={styles.icon}>⚙</div>
          <div>
            <h2>設定</h2>
            <p>出力や情報を見る。</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
