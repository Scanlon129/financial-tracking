import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './components/DashboardPage.jsx';

const App = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Financial Tracking</h1>
        <nav>
          <Link to="/">Dashboard</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="app-footer">Built with FastAPI, React &amp; AI assistance.</footer>
    </div>
  );
};

export default App;
