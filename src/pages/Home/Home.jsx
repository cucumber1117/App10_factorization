import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.label}>QUIZ × CALCULATOR</p>
          <h1>因数分解をクイズ感覚で練習しよう</h1>
          <p className={styles.description}>
            問題を解いてスコアを伸ばす「練習モード」と、式を確認できる「計算モード」を用意しました。
            クイズアプリのようにテンポよく、計算アプリのように見やすく使えます。
          </p>

          <div className={styles.heroButtons}>
            <Link to="/practice/easy" className={styles.primaryButton}>
              練習スタート
            </Link>

            <Link to="/calculate" className={styles.secondaryButton}>
              計算モードへ
            </Link>
          </div>
        </div>

        <div className={styles.quizPreview}>
          <div className={styles.previewHeader}>
            <span>Question</span>
            <strong>01</strong>
          </div>

          <div className={styles.previewQuestion}>x² + 5x + 6</div>

          <div className={styles.previewAnswer}>
            <span>x + 2</span>
            <span>x + 3</span>
          </div>

          <div className={styles.previewFooter}>
            <span>Score</span>
            <strong>+10</strong>
          </div>
        </div>
      </section>

      <section className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <span>LEVEL</span>
          <strong>3段階</strong>
          <p>簡単・普通・難しいから選択</p>
        </div>

        <div className={styles.statusCard}>
          <span>STYLE</span>
          <strong>クイズ形式</strong>
          <p>問題を解いて答え合わせ</p>
        </div>

        <div className={styles.statusCard}>
          <span>TOOL</span>
          <strong>計算モード</strong>
          <p>式を入力して確認</p>
        </div>
      </section>

      <section className={styles.menuGrid}>
        <Link to="/practice/easy" className={styles.menuCard}>
          <div className={styles.icon}>🌱</div>
          <div>
            <h2>簡単</h2>
            <p>まずは基本問題から。</p>
          </div>
        </Link>

        <Link to="/practice/normal" className={styles.menuCard}>
          <div className={styles.icon}>📘</div>
          <div>
            <h2>普通</h2>
            <p>少し考える問題に挑戦。</p>
          </div>
        </Link>

        <Link to="/practice/hard" className={styles.menuCard}>
          <div className={styles.icon}>🔥</div>
          <div>
            <h2>難しい</h2>
            <p>応用問題で実力アップ。</p>
          </div>
        </Link>

        <Link to="/calculate" className={styles.menuCard}>
          <div className={styles.icon}>🧮</div>
          <div>
            <h2>計算</h2>
            <p>入力した式をチェック。</p>
          </div>
        </Link>
      </section>
    </div>
  );
}