import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { HomePage } from './pages/home-page.tsx';
import { SignupPage } from './pages/signup-page.tsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
