import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { InputPage } from '@/pages/InputPage';
import { LoadingPage } from '@/pages/LoadingPage';
import { ReadingPage } from '@/pages/ReadingPage';
import { CompletionPage } from '@/pages/CompletionPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/loading/:storyId" element={<LoadingPage />} />
          <Route path="/read/:storyId" element={<ReadingPage />} />
          <Route path="/complete/:storyId" element={<CompletionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #8b5cf6',
            },
            success: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
