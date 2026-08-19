import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import OrderForm from './components/OrderForm';
import { Grid, Tag, Send } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [prefilledPackage, setPrefilledPackage] = useState('');
  const [prefilledArea, setPrefilledArea] = useState(100);

  useEffect(() => {
    // Notify Telegram Web App that it's ready & expand view
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0A0B0E');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#0A0B0E');
      }
    }
  }, []);

  const handleSelectPackageForOrder = (pkgName, areaSqM) => {
    if (pkgName) setPrefilledPackage(pkgName);
    if (areaSqM) setPrefilledArea(areaSqM);
    setActiveTab('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProjectForOrder = (projectName) => {
    setPrefilledPackage(`Loyiha asosida: ${projectName}`);
    setActiveTab('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Studio Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <img src="/logo.png" alt="PLATINUM Interior & Architecture" className="brand-official-logo" />
        </div>

        <div className="header-status-badge">
          <span className="pulse-dot"></span>
          <span>Online 24/7</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'portfolio' && (
          <Portfolio onSelectProjectForOrder={handleSelectProjectForOrder} />
        )}

        {activeTab === 'pricing' && (
          <Pricing onSelectPackageForOrder={handleSelectPackageForOrder} />
        )}

        {activeTab === 'order' && (
          <OrderForm prefilledPackage={prefilledPackage} prefilledArea={prefilledArea} />
        )}
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <Grid size={20} />
          <span>Ishlarimiz</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <Tag size={20} />
          <span>Narxlar</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          <Send size={20} />
          <span>Buyurtma</span>
        </button>
      </nav>
    </div>
  );
}
