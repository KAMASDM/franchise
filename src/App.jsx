import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Brands from './pages/Brands';
import BrandDetail from './pages/brand/BrandDetailPage';
import Blog from './pages/Blogs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import BrandSignIn from './pages/BrandSignIn';
import BrandRegistration from './pages/BrandRegistration';
import ApplicationSubmitted from './pages/ApplicationSubmitted';

function App() {
  return (
    <>
      <Header />
      <main style={{ flex: '1 0 auto', paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:id" element={<BrandDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/brand-signin" element={<BrandSignIn />} />
          <Route path="/brand-registration" element={<BrandRegistration />} />
          <Route path="/application-submitted" element={<ApplicationSubmitted />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;