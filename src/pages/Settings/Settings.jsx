import { Link } from "react-router-dom";
import { worksheetQuestionCount } from "../../data/factorQuestions";
import { practiceLevels } from "../../data/levels";
import styles from "./Settings.module.css";

export default function Settings() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.modeLabel}>Settings</p>
          <h2>設定</h2>
        </div>

        <div className={styles.settingsIcon}>⚙</div>
      </div>

      <div className={styles.settingList}>
        <div className={styles.settingItem}>
          <span>問題モード</span>
          <strong>5段階・ランダム生成</strong>
        </div>

        <div className={styles.settingItem}>
          <span>計算モード</span>
          <strong>4乗まで計算</strong>
        </div>

        <div className={styles.settingItem}>
          <span>おすすめアプリ</span>
          <strong>+-×÷計算問題</strong>
        </div>
      </div>
      

      <section className={styles.pdfSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.modeLabel}>PDF Export</p>
          <h3>PDF出力</h3>
        </div>

        <div className={styles.pdfGrid}>
          {practiceLevels.map((level) => (
            <Link
              key={level.key}
              to={`/worksheet/${level.key}`}
              className={styles.pdfButton}
            >
              <span>{level.icon}</span>
              <strong>{level.title}</strong>
              <small>{worksheetQuestionCount}問</small>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
