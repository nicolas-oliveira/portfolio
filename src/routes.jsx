import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Main from './pages/Main';
import Portfolio from './pages/Portfolio';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
