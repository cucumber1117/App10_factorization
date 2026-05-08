import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import PracticeMode from "./pages/PracticeMode/PracticeMode";
import FactorMode from "./pages/FactorMode/FactorMode";

import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.mobileHeader}>
        <div>
          <p className={styles.appLabel}>Math Quiz App</p>
          <h1>因数分解アプリ</h1>
        </div>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/practice/easy"
            element={<PracticeMode level="easy" title="簡単" />}
          />

          <Route
            path="/practice/normal"
            element={<PracticeMode level="normal" title="普通" />}
          />

          <Route
            path="/practice/hard"
            element={<PracticeMode level="hard" title="難しい" />}
          />

          <Route path="/calculate" element={<FactorMode />} />
        </Routes>
      </main>

      <nav className={styles.bottomNav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span>🏠</span>
          <p>ホーム</p>
        </NavLink>

        <NavLink
          to="/practice/easy"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span>🌱</span>
          <p>簡単</p>
        </NavLink>

        <NavLink
          to="/practice/normal"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span>📘</span>
          <p>普通</p>
        </NavLink>

        <NavLink
          to="/practice/hard"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span>🔥</span>
          <p>難しい</p>
        </NavLink>

        <NavLink
          to="/calculate"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span>🧮</span>
          <p>計算</p>
        </NavLink>
      </nav>
    </div>
  );
}