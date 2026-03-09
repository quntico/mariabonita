
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { EditableContentProvider } from '@/contexts/EditableContent.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';

function App() {
  return (
    <EditableContentProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background font-serif text-foreground selection:bg-primary selection:text-white">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </EditableContentProvider>
  );
}

export default App;
