import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import BookPickup from './pages/BookPickup';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutContact from './pages/AboutContact';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-surface font-sans text-on-surface antialiased">
          <Navbar />
          <main className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book-pickup" element={<BookPickup />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about-contact" element={<AboutContact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
