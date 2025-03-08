import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from '@/components/HomeScreen';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { BookManagement } from '@/modules/BookManagement';
import { BookBorrowing } from '@/modules/BookBorrowing';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/catalog" element={<BookManagement />} />
          <Route path="/circulation" element={<BookBorrowing />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;