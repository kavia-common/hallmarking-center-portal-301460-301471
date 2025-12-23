import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CenterInfo from './pages/CenterInfo';
import Portfolio from './pages/Portfolio';
import Register from './pages/Register';
import Login from './pages/Login';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

// PUBLIC_INTERFACE
function App() {
  /** Root application with router and layout (Header, Footer). Includes global ErrorBoundary and Toasts. */
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<CenterInfo />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
