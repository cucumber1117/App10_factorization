import { NavLink, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import ProblemSelect from "./pages/ProblemSelect/ProblemSelect.jsx";
import PracticeMode from "./pages/PracticeMode/PracticeMode";
import FactorMode from "./pages/FactorMode/FactorMode";
import Settings from "./pages/Settings/Settings.jsx";
import Worksheet from "./pages/Worksheet/Worksheet.jsx";

import styles from "./App.module.css";

export default function App() {
  const { pathname } = useLocation();
  const isPracticePage = pathname.startsWith("/practice");
  const isWorksheetPage = pathname.startsWith("/worksheet");
  const isToolPage =
    isPracticePage
    || pathname === "/calculate"
    || pathname === "/settings"
    || isWorksheetPage;

  return (
    <div className={styles.app}>
      {!isToolPage && (
        <header className={styles.mobileHeader}>
          <div>
            <p className={styles.appLabel}>Math Quiz App</p>
            <h1>因数分解ランダム問題</h1>
          </div>
        </header>
      )}

      <main className={isToolPage ? styles.practiceMain : styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<ProblemSelect />} />

          <Route
            path="/practice/easy"
            element={<PracticeMode key="easy" level="easy" title="簡単" />}
          />

          <Route
            path="/practice/normal"
            element={<PracticeMode key="normal" level="normal" title="普通" />}
          />

          <Route
            path="/practice/hard"
            element={<PracticeMode key="hard" level="hard" title="難しい" />}
          />

          <Route
            path="/practice/expert"
            element={<PracticeMode key="expert" level="expert" title="上級" />}
          />

          <Route
            path="/practice/master"
            element={<PracticeMode key="master" level="master" title="達人" />}
          />

          <Route path="/calculate" element={<FactorMode />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/worksheet/:level" element={<Worksheet />} />
        </Routes>
      </main>

      {!isWorksheetPage && (
      <nav className={isToolPage ? styles.practiceBottomNav : styles.bottomNav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span className={styles.navIcon}>⌂</span>
          <p>ホーム</p>
        </NavLink>

        <NavLink
          to="/practice"
          className={() =>
            isPracticePage ? styles.activeTab : styles.tab
          }
        >
          <span className={styles.navIcon}>?</span>
          <p>問題</p>
        </NavLink>

        <NavLink
          to="/calculate"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span className={styles.navIcon}>=</span>
          <p>計算</p>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          <span className={styles.navIcon}>⚙</span>
          <p>設定</p>
        </NavLink>
      </nav>
      )}
    </div>
  );
}
